# ad-kit

独立的游戏广告模块。游戏只调用它，不用关心背后是微信、网页还是别的平台。

- 单个文件，没有依赖，网页和微信小游戏都能用。
- 广告失败、没有广告、用户中途关闭，游戏都不会卡住。
- 只有用户看完激励广告才发奖。
- 自带频率控制：新玩家保护、每几局一次、冷却时间、每日上限。

## 接入

微信小游戏：

```js
const AdKit = require('./ad-kit.js');

const ads = AdKit.create({
  provider: AdKit.wechatProvider(wx),
  storage: AdKit.wechatStorage(wx),
  placements: AdKit.recommendedPlacements({
    rewarded: '你的激励广告位ID',
    interstitial: '你的插屏广告位ID',
    banner: '你的模板广告位ID',
  }),
  onEvent: e => console.log(e),
});
```

还没有广告位时，把 `provider` 换成 `AdKit.mockProvider()`，其余代码不用改。

## 在游戏里调用

```js
// 玩家死亡后，有广告才显示“看广告复活”按钮
if (ads.canShow('revive').ok) showReviveButton();

async function onReviveClick() {
  const { rewarded } = await ads.showRewarded('revive');
  if (rewarded) revivePlayer();
  else showGameOver();
}

// 每局结束
ads.noteRound();
await ads.showInterstitial('round_end');
```

## 默认位置

| 位置 | 类型 | 规则 |
| :--- | :--- | :--- |
| `revive` | 激励广告 | 玩家主动点击，每天最多 30 次 |
| `double_score` | 激励广告 | 玩家主动点击，每天最多 30 次 |
| `round_end` | 插屏广告 | 前 2 局和开局 60 秒内不放，之后每 3 局一次，间隔至少 2 分钟，每天最多 15 次 |
| `menu_banner` | 模板横幅 | 只放在菜单页，不放在游戏进行中 |

这些数字是起步值，上线后按留存和收入调整。

## 事件

`onEvent` 会收到 `ad_request`、`ad_shown`、`ad_reward`、`ad_skipped`、`ad_failed`、`ad_blocked`，可以接到自己的统计里。

## 测试和演示

```bash
node --test
```

用浏览器打开 `demo.html` 可以试用，里面是模拟广告。

## 注意

- 奖励判断目前在客户端。纯单机小游戏够用；如果奖励涉及排行榜或虚拟货币，需要加服务器校验。
- 微信适配层只用模拟的 `wx` 对象测试过，接入真实广告位后要在真机上再测一遍。
