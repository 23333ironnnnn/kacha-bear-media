// 把 pages/index.html 里的 8 页各截一张 1080×1440
const path = require('path')
const fs = require('fs')
const { chromium } = require('/Users/ironnn23333/Desktop/PB/node_modules/playwright-core')
const OUT = process.env.OUT || '/tmp/kacha-wxmp/out'
fs.mkdirSync(OUT, { recursive: true })
;(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--allow-file-access-from-files'] })
  const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 })
  await page.goto('file:///tmp/kacha-wxmp/pages/index.html')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  const want = (process.env.PAGES || '1,2,3,4,5,6,7,8').split(',')
  for (const n of want) {
    await page.locator(`#p${n}`).screenshot({ path: path.join(OUT, `P${n}.png`) })
    console.log('✓ P' + n)
  }
  console.log('fonts:', await page.evaluate(() => [...document.fonts].map((f) => `${f.family}:${f.status}`).join(',')))
  await browser.close()
})()
