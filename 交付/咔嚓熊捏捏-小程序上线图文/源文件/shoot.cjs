// 本地 v4 打包（127.0.0.1:4181）按小程序 UA 截图，给上线图文用。不碰线上、不发埋点。
// node shoot.cjs <scene...>   scene: home kinds play share recv nudge cookie shelf tiles
const path = require('path')
const fs = require('fs')
const { chromium } = require('/Users/ironnn23333/Desktop/PB/node_modules/playwright-core')

const BASE = 'http://127.0.0.1:4181/'
const OUT = '/tmp/kacha-wxmp/shots'
fs.mkdirSync(OUT, { recursive: true })
const WXMP_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.54(0x18003637) NetType/WIFI Language/zh_CN miniProgram/wx0000000000000000'
const FIX = require('/tmp/kacha-wxmp/src-v4/scripts/compat/saved-fixtures.json').recipes
const dec = (r) => JSON.parse(Buffer.from(r.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
const fx = (i) => FIX[i].r
const NOTICE_ID = 'v4.1.0-wxmp-2026-10-27'

// 货架上摆的（名字是展示用的）
const SHELF = [
  [20, '粉粉冰条球'], [0, '经典脆脆球'], [11, '葡萄汽水'], [15, '红草莓'], [21, '星星积木球'], [10, '蜜桃巧克力'],
  [14, '芒果猫爪'], [16, '青提'], [7, '抹茶幸运饼干'], [13, '黑巧星星'], [6, '抹茶冰皮月饼'], [12, '彩色小熊'],
]
function shelfItems() {
  const now = Date.now()
  return SHELF.map(([i, name], k) => ({ id: `sdemo${k.toString(36)}00`, name, r: fx(i), form: dec(fx(i)).f, ai: false, createdAt: now - k * 3600e3, updatedAt: now - k * 3600e3 }))
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function open({ mobile = true, width = 390, height = 844, dpr = 3, seedShelf = true, extraInit } = {}) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })
  const context = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile,
    userAgent: mobile ? WXMP_UA : undefined, locale: 'zh-CN', timezoneId: 'Asia/Shanghai', serviceWorkers: 'block',
  })
  await context.addInitScript(({ notice, shelf }) => {
    try {
      localStorage.setItem('kacha.notice.seen', notice)
      if (shelf && !localStorage.getItem('kacha.saved.v1')) localStorage.setItem('kacha.saved.v1', JSON.stringify(shelf))
    } catch {}
  }, { notice: NOTICE_ID, shelf: seedShelf ? shelfItems() : null })
  // 截图用：①「没声音？」那条（无头浏览器没出声）藏掉；② 分享卡上的二维码换成小熊头像、「扫码…」换成「点开就能捏…」（小红书图里不放二维码）
  await context.addInitScript(({ bear }) => {
    const img = new Image(); img.src = bear; window.__bearImg = img
    const isQr = (c) => {
      if (!(c instanceof HTMLCanvasElement) || c.width !== c.height || c.width > 600) return false
      const g = c.getContext('2d', { willReadFrequently: true }); if (!g) return false
      const d = g.getImageData(0, 0, c.width, c.height).data
      let dark = 0, light = 0, other = 0
      for (let i = 0; i < 400; i++) {
        const p = (Math.floor(Math.random() * c.width * c.height)) * 4
        const a = d[p + 3], l = (d[p] + d[p + 1] + d[p + 2]) / 3
        if (a < 20 || l > 225) light++; else if (l < 90) dark++; else other++
      }
      return dark > 40 && light > 40 && other < 30
    }
    const di = CanvasRenderingContext2D.prototype.drawImage
    CanvasRenderingContext2D.prototype.drawImage = function (src, ...a) {
      if (a.length === 4 && isQr(src) && window.__bearImg.complete) {
        const [x, y, w, h] = a
        this.save(); this.beginPath(); this.roundRect(x, y, w, h, w * 0.22); this.clip()
        di.call(this, window.__bearImg, x, y, w, h); this.restore(); return
      }
      return di.call(this, src, ...a)
    }
    const ft = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.fillText = function (t, ...a) {
      if (typeof t === 'string' && t.includes('扫码')) t = t.replace('扫码捏同一颗', '点开就能捏同一颗').replace('扫码就能捏到同一颗', '点开就能捏到同一颗').replace('扫码', '点开')
      return ft.call(this, t, ...a)
    }
    const tidy = () => {
      document.querySelectorAll('.craft-nudge').forEach((el) => { if (/声音/.test(el.textContent || '')) el.style.display = 'none' })
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.includes('二维码扫了也是')) n.textContent = n.textContent.replace(/卡上的二维码扫了也是。?/, '')
    }
    document.addEventListener('DOMContentLoaded', () => new MutationObserver(tidy).observe(document.body, { subtree: true, childList: true, characterData: true }))
  }, { bear: 'data:image/jpeg;base64,' + fs.readFileSync('/Users/ironnn23333/Desktop/make u nienie/src/assets/bear-mark.jpg').toString('base64') })
  if (extraInit) await context.addInitScript(extraInit)
  const captured = {}
  await context.route(/res\.wx\.qq\.com|posthog/, (r) => r.abort())
  await context.route(/\/api\//, async (route) => {
    const req = route.request()
    const u = new URL(req.url())
    if (u.pathname === '/api/link' && req.method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ path: 'g/KachaBe1', id: 'KachaBe1' }) })
    }
    const m = u.pathname.match(/^\/api\/link\/(\w+)\/(card|poster)$/)
    if (m && req.method() === 'POST') {
      const buf = req.postDataBuffer()
      if (buf) { captured[m[2]] = buf; fs.writeFileSync(path.join(OUT, `upload-${m[2]}.jpg`), buf) }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    }
    if (u.pathname.startsWith('/api/track')) return route.fulfill({ status: 204, body: '' })
    return route.fulfill({ status: 404, body: '' })
  })
  const page = await context.newPage()
  page.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 200)))
  return { browser, context, page, captured }
}

const HIDE_DEBUG = '.craft-debug{display:none!important}'
const HIDE_ALL = '.play-hud2-share-banner,.play-hud2-actions,.play-hud2-title,.play-hud2-name,.play-hud2-hint,.craft-nudge,.craft-top,.craft-topright,.craft-brand,.craft-debug,.play-hud2{display:none!important}.craft-panel{opacity:0!important}'
async function go(page, q = '', css = HIDE_DEBUG) {
  await page.goto(BASE + q, { waitUntil: 'load' })
  await page.waitForFunction(() => !!document.querySelector('#root > *'), null, { timeout: 20000 })
  await page.addStyleTag({ content: css })
  await sleep(1500)
}
async function fresh(q, opts = {}) {
  const o = await open(opts)
  await go(o.page, q, opts.css)
  return o
}
const R = (i) => `?debug&r=${fx(i)}`
const enc = (o) => Buffer.from(JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const HB = (hb, n) => `?debug&r=${enc({ v: 6, f: 'handball', e: 'gummy', c: 'mint', h: 'dark', s: 'medium', t: [], hb, d: [], n })}`
const FOAM_STRAW = HB(['foam', '', 'normal', 'strawberry', 'dense', '', 'mid', '', '', '', '', []], '草莓起泡胶')
const FOAM_PEACH = HB(['foam', '', 'normal', 'peach', 'dense', '', 'mid', '', '', '', '', []], '黄桃起泡胶')
const FOAM_SPREAD = HB(['foam', '', 'normal', 'mix:#ff88aa,#88ccff,#ffe08a', 'dense', '', 'mid', 'spread', '', '', '', [['cherry', 0.42, 0.27, 1.57, '', ''], ['bow', 0.1, -0.8, 3.14, '', '']]], '一摊混色起泡胶')
const shot = async (page, name) => { await page.screenshot({ path: path.join(OUT, `${name}.png`) }); console.log('  ✓', name) }
const st = (page, fn, arg) => page.evaluate(fn, arg)
async function press(page, x, y, holdMs = 140, finger) {
  await page.evaluate(([x, y, f]) => window.__nienie?.press(x, y, f), [x, y, finger])
  await sleep(holdMs)
  await page.evaluate((f) => window.__nienie?.release(f), finger)
}
async function waitNienie(page) { await page.waitForFunction(() => !!window.__nienie, null, { timeout: 20000 }); await sleep(900) }

const scenes = {
  // 首页（小程序模式：没有「保存到桌面」那些）
  async home() {
    const { browser, page } = await open()
    await go(page, '?debug')
    await sleep(1500)
    await shot(page, 'home')
    await page.locator('.craft-start-daily').first().screenshot({ path: path.join(OUT, 'el-daily.png') })
    await browser.close()
  },
  // 先选类型
  async kinds() {
    const { browser, page } = await open()
    await go(page, '?debug')
    await st(page, () => window.__craft.getState().restart())
    await sleep(3200)
    await shot(page, 'kinds')
    await browser.close()
  },
  // 巧克力线每一步的样子（挑一张做「自己做一颗」）
  async steps() {
    const { browser, page } = await fresh('?debug')
    await st(page, () => { const s = window.__craft.getState(); s.restart(); s.pickKind('choc') })
    await sleep(1500)
    for (const stage of ['mold', 'core', 'flavor', 'melt', 'dip', 'topping', 'decor', 'name']) {
      await st(page, (s) => window.__craft.getState().go(s), stage)
      await sleep(stage === 'dip' || stage === 'melt' ? 2600 : 1600)
      await shot(page, `step-${stage}`)
    }
    await browser.close()
  },
  // 冰条球那一颗的制作步骤（从配方进来再改回「自己做的」）
  async hbsteps() {
    const { browser, page } = await fresh(R(20))
    await st(page, () => { window.__craft.setState({ fromShare: false }) })
    for (const stage of ['core', 'flavor', 'melt', 'dip', 'topping', 'decor', 'name']) {
      await st(page, (s) => window.__craft.getState().go(s), stage)
      await sleep(2000)
      await shot(page, `hbstep-${stage}`)
    }
    await browser.close()
  },
  // 开捏：巧克力捏裂、冰条球、起泡胶按下去
  async play() {
    {
      const { browser, page } = await fresh('?debug')
      await st(page, () => window.__craft.getState().quickPlay())
      await waitNienie(page)
      for (const [x, y] of [[0, 0.05], [0.25, 0.15], [-0.22, 0.12], [0.1, -0.1], [-0.05, 0.2], [0.18, -0.02]]) await press(page, x, y, 420)
      await sleep(600)
      await page.evaluate(() => window.__nienie.press(0.02, 0.08))
      await sleep(380)
      await shot(page, 'play-choc')
      await page.evaluate(() => window.__nienie.release())
      await browser.close()
    }
    for (const [name, q] of [['play-ice', R(20)], ['play-blocks', R(21)], ['play-foam', FOAM_STRAW], ['play-foam-peach', FOAM_PEACH], ['play-foam-spread', FOAM_SPREAD]]) {
      const { browser, page } = await fresh(q)
      await st(page, () => window.__craft.setState({ fromShare: false }))
      await waitNienie(page)
      await press(page, 0, 0.05, 300)
      await sleep(500)
      await page.evaluate(() => window.__nienie.press(0.03, 0.06))
      await sleep(450)
      await shot(page, name)
      await page.evaluate(() => window.__nienie.release())
      await sleep(300)
      await browser.close()
    }
  },
  // 分享页（小程序模式主按钮「送给 TA」）+ 点了之后传上去的那张 5:4 聊天卡。SHARE_FX=0,21,… 挑哪几颗
  async share() {
    for (const i of (process.env.SHARE_FX || '20').split(',').map(Number)) {
      const { browser, page, captured } = await fresh(R(i))
      await st(page, () => window.__craft.setState({ fromShare: false, stage: 'share' }))
      await sleep(3800)
      await shot(page, `share-${i}`)
      const btn = page.getByRole('button', { name: /送给 TA/ })
      await btn.first().screenshot({ path: path.join(OUT, `el-sendta-${i}.png`) }).catch((e) => console.log('  el sendta', String(e).slice(0, 80)))
      if (await btn.count()) {
        await btn.first().click()
        for (let k = 0; k < 40 && !captured.card; k++) await sleep(250)
        if (captured.card) fs.renameSync(path.join(OUT, 'upload-card.jpg'), path.join(OUT, `card-${i}.jpg`))
        console.log('  card', i, !!captured.card)
      }
      await browser.close()
    }
  },
  // 朋友点开：底下那行「朋友分享给你的…」；捏到第 15 下冒回赠提示
  async recv() {
    const i = Number(process.env.FX || 20)
    const { browser, page } = await fresh(R(i))
    await waitNienie(page)
    await sleep(800)
    await shot(page, `recv-${i}`)
    await page.locator('.play-hud2-share-banner').first().screenshot({ path: path.join(OUT, `el-banner-${i}.png`) }).catch(() => console.log('  no banner'))
    await page.touchscreen.tap(40, 330)
    await sleep(400)
    for (let k = 0; k < 16; k++) { await press(page, (k % 3 - 1) * 0.1, 0.05, 300); await sleep(320) }
    const nudge = page.locator('.craft-nudge', { hasText: '做一颗送回去' })
    for (let k = 0; k < 40 && !(await nudge.count()); k++) await sleep(300)
    console.log('  nudge visible:', await nudge.count())
    await sleep(500)
    await shot(page, `recv-nudge-${i}`)
    await nudge.first().screenshot({ path: path.join(OUT, `el-nudge-${i}.png`) }).catch(() => console.log('  no nudge el'))
    await page.locator('.craft-nudge', { hasText: '做一颗送回去' }).first().click().catch(() => console.log('  no nudge button'))
    await sleep(1800)
    await shot(page, `ret-kinds-${i}`)
    await browser.close()
  },
  async ret() {
    const i = Number(process.env.FX || 20)
    const { browser, page } = await fresh(R(i))
    await waitNienie(page)
    await st(page, () => window.__craft.getState().startReturn())
    await sleep(2200)
    await shot(page, `ret-kinds-${i}`)
    await page.locator('.shelf-return').first().screenshot({ path: path.join(OUT, `el-retbadge-${i}.png`) }).catch(() => console.log('  no badge'))
    await browser.close()
  },
  // 透明底的单颗大图（分享卡同款 hero 取景）：封面 / 拼图用
  async heroes() {
    const list = (process.env.HEROES || 'choc,ice,blocks,foam,strawberry').split(',')
    const Q = {
      choc: '?debug', ice: R(20), blocks: R(21), foam: FOAM_STRAW, foampeach: FOAM_PEACH, foamspread: FOAM_SPREAD, wax: R(11), strawberry: R(15), grape: R(16),
      cookie: R(7), mooncake: R(6), peach: R(10), paw: R(14), star: R(13), bear: R(12), roundmc: R(5), icecream: R(1),
      iceheart: HB(['ice', '#f6d5e2', 'full', '#ff7fa8', 'dense', 'pink', 'thin', '', 'heart', ''], '爱心冰条球'),
    }
    for (const t of list) {
      const { browser, page } = await fresh(Q[t], { mobile: false, css: HIDE_ALL })
      if (t === 'choc') await st(page, () => window.__craft.getState().quickPlay())
      await waitNienie(page)
      if (t === 'choc') { for (const [x, y] of [[0, 0.05], [0.25, 0.15], [-0.22, 0.12], [0.1, -0.1], [-0.05, 0.2]]) await press(page, x, y, 420); await sleep(900) }
      await sleep(900)
      const url = await page.evaluate(() => window.__snapshot?.current?.({ hero: true, size: 1200 }) ?? null)
      if (url) { fs.writeFileSync(path.join(OUT, `hero-${t}.png`), Buffer.from(url.split(',')[1], 'base64')); console.log('  ✓ hero', t) } else console.log('  ✗ hero', t)
      await browser.close()
    }
  },
  async dbgnudge() {
    const { browser, page } = await fresh(R(21))
    await waitNienie(page)
    const dbg = () => page.evaluate(() => (document.querySelector('.craft-debug')?.innerText || '').replace(/\n/g, ' | ') + ' || fromShare=' + window.__craft.getState().fromShare + ' stage=' + window.__craft.getState().stage)
    for (let k = 0; k < 4; k++) { await press(page, 0, 0.05, 300); await sleep(350); console.log('  press', k, await dbg()) }
    const box = await page.locator('canvas').first().boundingBox()
    console.log('  canvas', JSON.stringify(box))
    for (let k = 0; k < 3; k++) { await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.45); await sleep(400); console.log('  tap', k, await dbg()) }
    await browser.close()
  },
  // 水果 / 其他几颗开捏（自己做的，不是朋友送的）
  async more() {
    for (const [name, i] of [['play-strawberry', 15], ['play-grape', 16], ['play-wax', 11], ['play-peach', 10]]) {
      const { browser, page } = await fresh(R(i))
      await st(page, () => window.__craft.setState({ fromShare: false }))
      await waitNienie(page)
      for (const [x, y] of [[0, 0.05], [0.2, 0.1], [-0.15, 0.0]]) await press(page, x, y, 380)
      await sleep(400)
      await page.evaluate(() => window.__nienie.press(0.02, 0.06))
      await sleep(420)
      await shot(page, name)
      await page.evaluate(() => window.__nienie.release())
      await browser.close()
    }
  },
  // 拼图那页用的：只留画面（藏掉所有界面），桌面模式画布清晰度更高
  async tiles() {
    const list = (process.env.TILES || 'choc,ice,blocks,foam,wax,strawberry,grape,cookie,mooncake,peach,paw,star').split(',')
    const Q = {
      choc: '?debug', ice: R(20), blocks: R(21), foam: FOAM_STRAW, foampeach: FOAM_PEACH, foamspread: FOAM_SPREAD, wax: R(11), strawberry: R(15), grape: R(16),
      cookie: R(7), mooncake: R(6), peach: R(10), paw: R(14), star: R(13), bear: R(12), foammix: '?debug&handball=foam&foam=mix:ff88aa,88ccff,ffe08a,b8f0c0&charm=cherry,bow,starcandy,flower',
      iceheart: '?debug&handball=ice&shape=heart&tint=sakura', orange: '?debug&fruit=orange',
    }
    for (const t of list) {
      const { browser, page } = await fresh(Q[t], { mobile: false, css: HIDE_ALL })
      if (t === 'choc') await st(page, () => window.__craft.getState().quickPlay())
      await waitNienie(page)
      if (t === 'choc') { for (const [x, y] of [[0, 0.05], [0.25, 0.15], [-0.22, 0.12], [0.1, -0.1], [-0.05, 0.2]]) await press(page, x, y, 420); await sleep(700) }
      await sleep(900)
      await shot(page, `tile-${t}`)
      await browser.close()
    }
  },
  // 每日幸运饼干：首页那张卡 → 掰开 → 签文卡
  async cookie() {
    const { browser, page } = await fresh('?debug')
    await page.locator('.craft-start-daily').click()
    await waitNienie(page)
    await sleep(600)
    await shot(page, 'cookie-before')
    for (let i = 0; i < 4; i++) { await press(page, 0, 0.02, 520); await sleep(700) }
    await sleep(2200)
    await shot(page, 'cookie-card')
    await page.locator('.mc-wish-card.daily').first().screenshot({ path: path.join(OUT, 'el-fortune.png') }).catch(() => console.log('  no fortune el'))
    await browser.close()
  },
  // 我做的捏捏（货架按配方还原 3D）
  async shelf() {
    const { browser, page } = await fresh('?debug')
    await page.getByRole('button', { name: /我做的捏捏/ }).click()
    await sleep(4500)
    await shot(page, 'shelf')
    await browser.close()
  },
}

;(async () => {
  const want = process.argv.slice(2)
  for (const name of want) {
    if (!scenes[name]) { console.log('no scene', name); continue }
    console.log('scene', name)
    try { await scenes[name]() } catch (e) { console.log('  ✗', name, String(e).slice(0, 300)) }
  }
})()
