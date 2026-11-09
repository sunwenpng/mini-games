# 小游戏合集

两款竖屏网页小游戏，外加一个独立的广告模块。手机、电脑打开浏览器就能玩。

在线试玩：https://sunwenpng.github.io/mini-games/

| 目录 | 内容 |
| :--- | :--- |
| [`threshold/`](threshold/) | **启扉 / Threshold**：多信仰文化体验平台；汉传佛教包可玩（简 / 繁 / English），泰国上座部包为未经审核的预览（ไทย / English / 简体），修行只记录，扫院子攒粮照顾动物 |
| [`temple-yard/`](temple-yard/) | 山寺小院：敲木鱼、礼佛、诵经，救助流浪小动物 |
| [`temple-yard-v4/`](temple-yard-v4/) | 山寺小院 v4：新手引导、目标行、随喜广告、存档备份（原版保留不动） |
| [`sky-breakout/`](sky-breakout/) | 云霄突围：竖屏 3D 飞机射击 |
| [`ad-kit/`](ad-kit/) | 广告模块：频控、发奖、失败兜底，网页和微信小游戏通用 |
| [`docs/设计思路.md`](docs/设计思路.md) | 两款游戏的设计、数值和后续方向 |
| [`docs/微信小游戏上线与推广.md`](docs/微信小游戏上线与推广.md) | 上微信小游戏的资质、移植、广告和推广方案 |

## 本地运行

每个游戏目录里双击 `index.html` 即可。没有依赖，不用安装。

`ad-kit` 的测试：

```bash
node ad-kit/ad-kit.test.js
```

## 说明

- 画面全部用代码画在 canvas 上，声音用 WebAudio 合成，没有素材文件。
- 广告目前是模拟广告。
- 山寺小院的经文取自通行版本，正式上线前建议再校对一遍。
