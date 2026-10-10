# kacha-bear-media

咔嚓熊（[`23333ironnnnn/kacha-bear`](https://github.com/23333ironnnnn/kacha-bear)）发布视频 / 纯享视频的**源素材和成片**。
代码仓库把 `promo-video/public/` 和 `promo-video/out/` 都 gitignore 了，这里就是那两个目录的备份，**目录结构和代码仓库一模一样**，放回去就能重渲。

## 放回去

```bash
# 在代码仓库根目录（make u nienie）执行；只补缺的、不覆盖新的
rsync -a --ignore-existing ../kacha-bear-media/promo-video/ promo-video/
```

Remotion 合成在代码仓库 `promo-video/src/Composition.tsx`（`npm run dev` 预览、`npx remotion render <id>` 渲染）。

## 里面有什么（2026-10-04 整理 365 MB；10-10 追加 V3.0.3 91 MB；单文件最大 39 MB）

> 10/10 用户定不再做解说类发布视频：代码仓库里 `KachaV301` / `KachaV303` 两个合成、录屏编排（`rig/takes.cjs`、`rig/takes-v303.cjs`）和配音脚本（`rig/vo.sh`、`rig/vo-v303.sh`）都删了，删之前最后一版在 `dc31eac`（`git show dc31eac:promo-video/src/V303.tsx`）。素材只在这里。

| 版本 | 路径 | 是什么 | 哪个合成用 |
| --- | --- | --- | --- |
| V1（9/13） | `public/media/gameplay.mp4`（24 MB） | 第一版录屏 | `KachaBearPromo` / `KachaBearVideoOnly` |
| V1 | `public/media/kacha-optimized-base.mp4`（10 MB） | 优化版底片 | `KachaBearOptimized` |
| V1 | `public/media/user-edit-1080.mp4`（13 MB） | 9/13 手剪的一版 | 没有合成引用，只是留档 |
| V1 | `public/voice/narration-cut.wav`（6 MB）、`public/voice/raw/*.m4a`（9 段，3 MB） | 真人口播剪好的 / 原始录音 | `KachaBearPromo` |
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

## 不在这里的

- 小红书小工具 zip：在代码仓库各版本标签里（`git show v3.0.1:release/kacha-bear-xhs-minitool.zip > x.zip`）。
- V3.0.1 原始录屏 `_takes/`（22,957 帧 jpg + webm）：10/4 删了，没备份；需要就用 `promo-video/rig` 重录。
- V3.0.3 原始录屏 `_takes/`（3.2 GB）：10/10 删了，没备份。
- 小红书上发出去的最终版本以小红书为准，这里的成片是上传前的文件。

## 规矩

- 只加文件，不改历史；每次发版后把新一版的素材和成片按同样目录结构追加一个 commit。
- 单文件 < 100 MB（GitHub 限制）；超了就先压成 1080p 再放。
