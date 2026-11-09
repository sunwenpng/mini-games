# 启扉 / Threshold 第四阶段交付报告

版本：v1.0  
日期：2026-11-09  
作者：Claude  
分支：`claude/threshold-platform`（在 Codex 分支 `codex/temple-yard-v4` 之上）  
线上：https://sunwenpng.github.io/mini-games/threshold/

---

## 0. 结论

第一批方案里**代码能做的任务卡已经全部完成**；剩下的都是需要人来做的事：顾问、母语审校、自有录音、商标检索、真机测试。`node tools/release-check.mjs` 会逐项列出（目前 14 个阻塞项，全部属于这几类）。

| 任务卡 | 状态 | 说明 |
| :--- | :--- | :--- |
| P0-1 合并两个 v4 | 完成（不删旧版） | 以 Codex 分支为底；平台存档码覆盖 GitHub v4 的导入导出需求；F7/F8 迁移测试在平台测试里。按你的要求，GitHub 上的 `temple-yard-v4/` 保留不删 |
| P0-2 资源循环改造 | 完成（第二阶段） | 修行只记录；出坡攒粮；“随喜”改名“支持我们” |
| P1-1 平台首页与选择 | 完成 | 新增“内测预览”状态与进入前确认 |
| P1-2 数据模型 | 完成 | 新增节历、`saveKeys`、`notice`、包级规则字段 |
| P1-3 抽 locale key | 用“文字出口翻译”代替 | 山寺小院是 Canvas，在绘制出口按词表翻译（English、繁體），测试保证漏翻为 0；平台和泰国包本来就是 key 方式 |
| P1-4 伪语言与 RTL 压力测试 | 完成（第一阶段） | |
| P1-5 母品牌 | 代码部分完成 | 三个方向、锁版、应用图标裁切、单色、黑白打印；商标检索需要人做 |
| P2-1 界面改 DOM | 在泰国包上验证 | 泰国包是“DOM 界面 + Canvas 场景”，泰文断行交给浏览器；山寺小院保持 Canvas，不重写 |
| P2-2 繁中、English 框架 | 完成 | 平台和山寺小院都有简 / 繁 / English |
| P2-3 自有《心经》录音 | 需要人 | 权利链字段和审核门已就绪 |
| P3-1 泰国上座部包 | 预览完成 | 可进入，但必须确认“未经审核”；顾问与泰语审校前不能转为正式 |
| P3-2 非寺院型传统推演 | 完成 | 锡克教谒师所，见 `docs/Claude_非寺院型传统纸面推演_锡克教_v1.md` |

## 1. 本阶段新增与修改

**新增**
- `threshold/traditions/buddhism.theravada.th/`：`pack.js`、`content.js`（五段巴利文）、`game/`（`index.html`、`game.css`、`i18n.js`、`scene.js`、`game.js`）
- `threshold/traditions/sikhism.gurdwara/pack.js`
- `threshold/core/calendar.js`
- `threshold/locales/zh-TW.js`、`threshold/traditions/buddhism.han/game/i18n-zh-TW.js`
- `threshold/manifest.webmanifest`、`threshold/sw.js`、`threshold/brand/` 下的 PNG 图标与 `app-icon.svg`
- `tests/threshold-th.test.mjs`
- `tools/release-check.mjs`、`tools/gen-zh-tw.py`
- 本文和锡克教推演文档

**修改**
- `core/app.js`：预览确认、节历面板、显示设置、隐私说明、存档码带游戏进度、图标板、版本界面语言默认跟随平台语言
- `core/save.js`：`acks`、`display` 字段；存档码新格式 `{ thrs: 2, platform, packs }`，旧格式照样能读
- `core/rights.js`：新增内容类型 homage / refuge / precepts / recollection / metta
- `data/registry.js`：`preview` 状态、`needsAck`、泰国包与锡克教包、繁中与泰语状态改为 draft、新增旁遮普语条目
- 山寺小院 `game.js`：繁体转换（词组优先、逐字兜底、可重复执行）、经文换传统字形、节日提示
- 测试：平台 22 项、汉传 14 项

原版 `temple-yard/`、`temple-yard-v4/` 一行没动。

## 2. 自动测试

```bash
node --test tests/threshold.test.mjs tests/threshold-han.test.mjs tests/threshold-th.test.mjs tests/temple-yard-v4.test.mjs
```

53 项全部通过。本阶段新增的覆盖：
- 简体、繁體、English 三套平台文案 key 一致，每个页面在繁體下都能完整渲染、不缺文案。
- 预览版本没勾选确认时没有进入链接。
- 节历：2027-05-13 是农历四月初八，2026-11-09 是十月初一，2026-12-25 是十一月十七；泰国四大节日按官方日期；佛日都标“估算”；月相在满月附近误差小于 1.2 天。
- 存档码带游戏进度往返一致；未知键和坏数据被丢掉；旧格式能读。
- 繁体：山寺小院全部中文字面量转换后不残留简体字（人名等有意保留的除外），转换可重复执行；经文逐字绘制时不会被二次改字。
- 泰国包：布施只在 6–8 点、僧人停下时才能放饭、一天只记一次、演示不花米也不记；修行不产出；动物照护、伤愈、起名、送养；离线 3 小时；平台选择双向同步；存档损坏恢复；场景 24 小时 × 三季 × 下雨 × 托钵绘制不出非法数值。

## 3. 浏览器检查（手机宽度 375 px）

- 平台：佛教版本页、泰国包设置页、预览确认、节历、繁體设置页、品牌图标板，无控制台报错、无横向溢出。
- 菩提静院：中文与泰文界面、诵读器（泰文字母 + 拉丁转写 + 中文译文）、托钵演示、狗和猫、叶堆。
- 山寺小院：繁體界面与繁体经题。

## 4. 文化与版权待审核项

1. 泰国包五段巴利文的泰文字母写法（按泰国诵本常见体例）、拉丁转写、三种译文。
2. 泰国包礼仪说明：脱鞋、衣着、脚的方向、女性不直接递物给僧人、布施不说话不求祝福、回向（กรวดน้ำ）的描述。
3. 泰国佛日按中国农历日估算（初八、十五、廿三、月末），实测与 2026 年三宝节差一天，已标“估算”。
4. 汉传节日日期是通行说法，各地寺院可能不同。
5. 繁体用台湾用语（如“介面”“支援”），香港用户可能需要另一套。
6. 场景里布萨堂门内的坐佛是小剪影，不可点击；需要顾问确认是否合适。

## 5. 未完成内容和下一步

- **需要人**：顾问、母语审校（English、繁體、ไทย）、自有录音、商标检索、真机测试。
- **可以接着做的代码工作**（有了顾问意见之后）：泰国包按审校结果升级 `reviewStatus`；佛日改用顾问提供的官方日期表；锡克教包在有合作谒师所后进入制作；`entryRequirements` 统一成平台字段。
