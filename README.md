# kacha-bear-media

咔嚓熊（[`23333ironnnnn/kacha-bear`](https://github.com/23333ironnnnn/kacha-bear)）发布视频 / 纯享视频的**源素材和成片**。
代码仓库把 `promo-video/public/` 和 `promo-video/out/` 都 gitignore 了，这里就是那两个目录的备份，**目录结构和代码仓库一模一样**，放回去就能重渲。

## 放回去

```bash
# 在代码仓库根目录（make u nienie）执行；只补缺的、不覆盖新的
rsync -a --ignore-existing ../kacha-bear-media/promo-video/ promo-video/
```

Remotion 合成在代码仓库 `promo-video/src/Composition.tsx`（`npm run dev` 预览、`npx remotion render <id>` 渲染）。V4.1 的 `KachaV41` / `KachaV41Cover` 别用 `npx remotion render`（它会把整个 `public/` 拷一遍，本地 `_takes/` 有好几 GB），用 `node promo-video/rig/render-v41.cjs`。V4.2 同理：`node promo-video/rig/render-v42.cjs [万圣节 拍照变捏捏 限时赛]`（不带参数三条全出；半分辨率预览 `node promo-video/rig/preview-cut-v42.cjs --id=KachaV42Photo`）。

## 里面有什么（2026-10-04 整理 365 MB；10-10 追加 V3.0.3 91 MB；10-26 追加 V4.1 300 MB；10-27 追加新物集封面 1.5 MB；10-28 补 Tripothon 174 MB、交付文件夹 48 MB；10-31 追加 V4.2 素材 148 MB + 成片 91 MB + 交付 95 MB（成片在 `out/` 和 `交付/` 各一份、内容相同，git 只存一份）；单文件最大 52 MB）

> 10/10 用户定不再做解说类发布视频：代码仓库里 `KachaV301` / `KachaV303` 两个合成、录屏编排（`rig/takes.cjs`、`rig/takes-v303.cjs`）和配音脚本（`rig/vo.sh`、`rig/vo-v303.sh`）都删了，删之前最后一版在 `dc31eac`（`git show dc31eac:promo-video/src/V303.tsx`）。同一天 V1 解说宣传片的三个合成（`KachaBearPromo` / `KachaBearVideoOnly` / `KachaBearOptimized`）也删了（`0732639`），源码在标签 `v3.0.3` 里（`git show v3.0.3:promo-video/src/PromoVideo.tsx`）。素材只在这里。

| 版本 | 路径 | 是什么 | 哪个合成用 |
| --- | --- | --- | --- |
| V1（9/13） | `public/media/gameplay.mp4`（24 MB） | 第一版录屏 | `KachaBearPromo` / `KachaBearVideoOnly`（10/10 已删） |
| V1 | `public/media/kacha-optimized-base.mp4`（10 MB） | 优化版底片 | `KachaBearOptimized`（10/10 已删） |
| V1 | `public/media/user-edit-1080.mp4`（13 MB） | 9/13 手剪的一版 | 没有合成引用，只是留档 |
| V1 | `public/voice/narration-cut.wav`（6 MB）、`public/voice/raw/*.m4a`（9 段，3 MB） | 真人口播剪好的 / 原始录音 | `KachaBearPromo`（10/10 已删） |
| V1 | `out/01a09a55-….png`、`out/kacha-bear-voice-only.{wav,m4a}` | 封面图、口播单独导出 | — |
| V2（9/17） | `public/media/pure-wax-raw.mov`（6 MB）、`pure-choc-raw.mov`（8 MB） | 极光蜡壳 / 黑巧脆壳纯享原始录屏 | `PureWax` / `PureChoc` |
| V2（9/20） | `public/media/v2/raw1–7.mp4`、`two-finger.mp4`（23 MB）、`v2/vo/vo01–14.{wav,m4a}`（12 MB） | V2 发布视频 7 段录屏 + 双指镜头 + 14 段 AI 配音 | V2 发布视频用的是 Shotcut（工程在代码仓库 `v2` 分支 `promo-video/shotcut/`），不是 Remotion |
| V2 | `out/咔嚓熊-V2-发布-1080p.mp4`、`-无口播-1080p.mp4`（35 MB） | V2 发布成片（9/20 发小红书） | — |
| V2 | `out/咔嚓熊-纯享-极光蜡壳-{1080p60,4K60}.mp4`、`-黑巧脆壳-{1080p60,4K60}.mp4`（98 MB） | 两条纯享成片各两档 | — |
| V2 | `out/xhs-v2-cards/01–09.png`（5 MB） | 「9 张图看完 V2 更新」图文笔记的九张图 | — |
| V3.0.1（10/3） | `public/media/v301/0–6*.mp4`（10 段，57 MB） | rig 自动录屏剪好的 10 段（`promo-video/rig/`，原始 takes 4.9 GB 已删，重录十几分钟） | `KachaV301` / `KachaV301Clean`（10/10 已删）；`Tripothon` 也用其中 4 段 + 片尾图标，重渲它先放回来 |
| V3.0.1 | `public/media/v301/_saved/*.json`、`icon-512.png` | 录制用的存档 fixture、片尾图标 | 同上 |
| V3.0.1 | `public/voice/v301-vo/{云夏,晓伊}/vo*.{wav,mp3}`（20 MB）、`混搭/全片口播….mp3` | edge-tts 配音两个声音各一套 + 混搭全片试听（成片 = 云夏开头结尾 + 晓伊正文；落选的云扬已删） | `KachaV301` |
| V3.0.1 | `out/咔嚓熊-V3.0.1-发布-1080p.mp4`、`-无口播-1080p.mp4`（33 MB）、`out/v301-still-480.png` | V3.0.1 发布成片（−16 LUFS）/ 无口播版 / 抽帧 | — |
| V3.0.3（10/9） | `public/media/v303/*.mp4`（12 段，50 MB）、`_saved/*.json` + `link.txt` | rig 自动录屏剪好的 12 段 + 录制时存下的存档（页面开在线上域名、请求转到本机录屏服务录的） | `KachaV303` / `KachaV303Clean`（10/10 已删） |
| V3.0.3 | `public/voice/v303-vo/{云夏,晓伊}/vo0–6.{wav,mp3}`、`全片口播-*.mp3`（13 MB） | edge-tts 配音两个声音各一套（预览用的是云夏 vo0 / vo6 + 晓伊 vo1–vo5） | 同上 |
| V3.0.3 | `out/咔嚓熊-V3.0.3-预览-1080p.mp4`、`-预览-无口播-1080p.mp4`（28 MB） | 3.0.3 发布视频预览（64 s，−16 LUFS）/ 无口播版。**没发**：10/10 用户定不做解说视频 | — |
| Tripothon（10/5，10/28 才补进来） | `public/media/tripothon/{S1-做月饼,S2-藏物-Tripo,S2-wait-x20,S3-写话-装盒-送出,S3-…-masked,R1-朋友-捏开}.mp4`（6 段，54 MB） | `rig/tripothon.cjs` 录的送礼线剪好的段落（S2 是 Tripo 文生 3D 藏进月饼那段，等待过程 ×20 倍速） | `KachaTripothon`（`src/Tripothon.tsx`） |
| Tripothon | `public/media/tripothon/stills/`（42 张，含 `spin/` 兔子自转角度）、`_sheets/`（26 张联系表）、`_explore/`（15 张流程截图）、`_saved/*-link.txt`（录制用的分享链接） | 原片抽帧 + `rig/tripothon.cjs views` 截的多视角；看板 / 封面用这些图 | `TripothonCovers` / `TripothonBoards`（`src/TripothonStills.tsx`） |
| Tripothon | `public/voice/tripothon-vo/{Ava,Ana,Andrew,Emma}/vo*.{wav,mp3}`、`试听-*.mp3`、`Ava/全片口播-Ava.mp3`（12 MB） | edge-tts 英文口播，四个声音的试听；成片用 Ava | `KachaTripothon` |
| Tripothon | `out/Tripothon-提交/`（演示视频 22 MB + 封面 A/B/C + 看板 1–8）、`out/tripothon-cover/`、`out/tripothon-board/`（Remotion 直出的同一套图）、`out/tripothon-preview.mp4`、`out/咔嚓熊-Tripothon-demo.mp4`（= 提交的演示视频）、`-demo-raw.mp4`（母带前）、`out/tri-check/`（校对截图） | 10/5 交黑客松的那一套 | — |
| V4.1（10/26） | `public/media/v41/*.mp4` + `*.marks.json`（16 段，207 MB） | rig 代录的 16 段（录的 v4 本地构建，画布 1170×2532），marks 记每次按下 / 松手的时刻、帧率、画布尺寸 | `KachaV41` |
| V4.1 | `public/media/v41/_still/`、`_proxy/`、`_data/gestures.json`、`_env/`（14 MB） | `rig/prep-v41.cjs` 备的料：抠圆的球（`*-press` 给封面）、九宫格小样、爪子轨迹、声波条用的响度包络 | `KachaV41` / `KachaV41Cover` |
| V4.1 | `public/media/v41/sfx/*.wav`（2 MB） | `rig/sfx-v41.cjs` 代码合成的「啵 / 盖章 / 唰 / 嗒」+ S5 轻节拍，随时能重新生成 | `KachaV41` |
| V4.1 | `public/media/v41/share-{poster,color}.png`、`brand/bear-mark.jpg` | 分享卡原图（S8 用海报卡）、小熊头像 | `KachaV41` / `KachaV41Cover` |
| V4.1 | `public/media/v41/storyboard.jpg`、`ref/`（31 张）、`_probe/`、`probe-sheet.jpg`、`_s-*.jpg`、`_sheet-ice-letter.jpg`（22 MB） | 分镜图 + 参考帧，量球位置的截图和挑帧用的联系表 | — |
| V4.1 | `public/media/v41/_preview/素材预览.mp4`、`素材联系表.jpg`（11 MB） | 步骤 2 给用户验收素材用的预览 | — |
| V4.1 | `public/media/fonts/ZCOOLKuaiLe-Regular.ttf` + `OFL.txt` | 站酷快乐体（OFL，可商用） | `KachaV41` / `KachaV41Cover` |
| V4.1 | `out/咔嚓熊-V4.1-手作球-宣传片-1080p.mp4`（39 MB）、`-封面.png` | V4.1 手作球宣传片成片（37 s，无口播，−19 LUFS）+ 3:4 封面 1080×1440 | — |
| 新物集（10/26） | `out/咔嚓熊-新物集-封面-3x4.png`（1.5 MB） | 投新物集「AI 游戏流量奖池」用的通用版 3:4 封面 1080×1440：V4.1 那张去掉「来了 / 新品类」，标题「咔嚓熊」+ 印章「解压捏捏」+ 副标题「自己做一颗 · 捏到停不下来」；提交记录在代码仓库 `V4/咔嚓熊-新物集提交.md`（分支 `feat/xwj`） | `KachaXwjCover`（代码仓库 `feat/xwj`，`node promo-video/rig/render-v41.cjs` 同一套料） |
| V4.2（10/30–31） | `public/media/v42/*.mp4` + `*.marks.json`（13 段，73 MB） | `rig/takes-v42.cjs` 代录的 v4.2.0 小工具本地构建（780×1688 视口 ×1.5 = 1170×2532 · 60 fps）：刻脸 / 刻完会说话 / 每日位幸运南瓜 / 四色皮 / 装饰 / 拍照变捏捏 / 限时赛 / 晚安 / 冷开场；marks 记每次按下 / 松手 | `KachaV42`（四条剪法：合集 / 万圣节 / 拍照变捏捏 / 限时赛） |
| V4.2 | `public/media/v42/sfx/*.wav`（12 条，19 MB） | `rig/sfx-v42.cjs` 代码合成：万圣节小调（音乐盒 + 管风琴）`music.wav` + 三条分片配乐 `music-{halloween,photo,race}.wav`、蝙蝠四声、快门、滚动、两下点按；随时能重新生成（噪声随机数固定） | `KachaV42` |
| V4.2 | `public/media/v42/_cover/*.png`（5 张）、`cat.jpg`（Unsplash License 猫照）、`_cat-orange-作废.jpg`、`_data/gestures.json` | `rig/cover-stills-v42.cjs` 录的封面底图（390×844 @3x；`race.png` 是 race.mp4 21.95 s 那帧）+ 拍照段用的图库猫 + 爪子轨迹 | `KachaV42Cover`（六张封面 Still） |
| V4.2 | `public/media/v42/_cand/`（68 张）、`_probe/`（26）、`_check/`（57）、`_preview/素材预览.mp4` + `素材联系表.jpg`（合计 52 MB） | 挑帧的候选 / 量位置的探测截图 / 成片逐帧检查 / 步骤 2 给用户验收素材用的预览 | — |
| V4.2 | `out/咔嚓熊-V4.2-{万圣节,拍照变捏捏,限时赛}-宣传片-1080p.mp4` + 三张 `-封面.png`、`咔嚓熊-V4.2-合集-宣传片-1080p.mp4`、`V42-*`（粗剪 / 配乐 / 拍照 / 限时赛预览、片尾检查、联系表、四张封面候选 + 对比）（19 个，91 MB） | 三条成片（29.6 s / 15 s / 15 s，1080×1920 · 30 fps · −19.3 LUFS · AAC 256k）+ 第一版合集 36 s + 过程预览 | — |

## 交付/（10/28 起）：不是视频素材、但也只在本机的那几个交付文件夹（桌面上的原样搬进来）

| 文件夹 | 是什么 |
| --- | --- |
| `交付/咔嚓熊捏捏-小程序上线图文/` | 10/27 小程序上架用的公众号 / 小红书图文：封面 + 8 张 + 一桌捏捏 + 备选封面、`总览.jpg`、`文案.txt`；`源文件/` 是出图的 html 模版、截图脚本（`shoot.cjs` / `render.cjs`）、抠图脚本和 `shots/` 原始截图、站酷快乐体 |
| `交付/咔嚓熊-手作球声音试听/` | V4.1 手作球定声音时给用户试听的 7 条候选（冰条 / 积木 / 纯胶 / 起泡胶）+ 3 段真实起泡史莱姆参考 + `怎么选.txt` / `点这里试听.html` / 参考来源 |
| `交付/咔嚓熊-新物集提交/` | 投新物集的四样：`铁铁-咔嚓熊-4.1.0.zip`（和代码仓库 `feat/xwj` 的 `release/新物集/` 同一个，md5 `2c40d63c…`）、3:4 封面（= `out/咔嚓熊-新物集-封面-3x4.png`）、1:1 图标（= 代码仓库 `public/icons/icon-512.png`）、基础信息 / 复核两封回信稿（联系方式是空的占位） |
| `交付/咔嚓熊-V4.2-万圣节图文/` | 10/31 万圣节笔记的图文：`今晚发这8张/`（封面 + 怎么玩 / 幸运南瓜 / 会说话 / 刻脸南瓜 / 万圣节装饰 / 拍照变捏捏 / 限时赛）、封面候选 B–E + `封面对比.jpg`、`总览.jpg`、`文案.txt`、`猫对比（不发）.jpg` |
| `交付/咔嚓熊-V4.2-万圣节宣传片/` | 给用户的三条成片 + 三张封面 + 三张联系表（和 `out/` 里的逐字节相同）；`旧版/` 是第一版合集 36 秒 + 它的封面 / 联系表、第 3 步的粗剪预览和四张封面候选 |

## 不在这里的

- 小红书小工具 zip：在代码仓库各版本标签里（`git show v3.0.1:release/kacha-bear-xhs-minitool.zip > x.zip`）。
- V3.0.1 原始录屏 `_takes/`（22,957 帧 jpg + webm）：10/4 删了，没备份；需要就用 `promo-video/rig` 重录。
- V3.0.3 原始录屏 `_takes/`（3.2 GB）：10/10 删了，没备份。
- Tripothon 原始录屏 `_takes/`（3.9 GB）：10/10 删了，没备份（剪好的段落、配音、成片 10/28 已补进来，见上表）。
- V4.1 原始帧 `public/media/v41/_takes/`（3.8 GB）：没备份；要重录用代码仓库的 `promo-video/rig/takes-v41.cjs`（录本地构建 `npx vite preview --port 4175`，别录线上）。
- V4.1 原片 `out/咔嚓熊-V4.1-手作球-宣传片-raw.mkv`（45 MB，做母带之前的无损音轨）没放：`render-v41.cjs` 两分钟就能重出。
- V4.2 原始帧 `public/media/v42/_takes/`（2.4 GB）：10/31 删了，没备份；要重录用代码仓库的 `promo-video/rig/takes-v42.cjs`（录本地 v4.2.0 小工具构建 `npm run preview:xhs`，别录线上）。
- V4.2 原片 `out/咔嚓熊-V4.2-{万圣节,合集}-宣传片-raw.mkv`（27 + 34 MB，母带前的无损音轨）没放：`render-v42.cjs` 重出。
- 小红书上发出去的最终版本以小红书为准，这里的成片是上传前的文件。

## 规矩

- 只加文件，不改历史；每次发版后把新一版的素材和成片按同样目录结构追加一个 commit。
- 单文件 < 100 MB（GitHub 限制）；超了就先压成 1080p 再放。
