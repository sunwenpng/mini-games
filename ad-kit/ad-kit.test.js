const test = require('node:test');
const assert = require('node:assert');
const AdKit = require('./ad-kit.js');

const DAY = 86400000;

function kit(options = {}) {
  const clock = { t: Date.parse('2026-11-06T12:00:00Z') };
  const events = [];
  const ads = AdKit.create({
    provider: options.provider || AdKit.mockProvider(options.mock),
    placements: options.placements || AdKit.recommendedPlacements({ rewarded: 'r', interstitial: 'i', banner: 'b' }),
    storage: options.storage,
    timeoutSec: options.timeoutSec,
    now: () => clock.t,
    onEvent: e => events.push(e),
  });
  return { ads, clock, events };
}

function fakeAd(behavior) {
  const close = new Set();
  const error = new Set();
  return {
    close, error, loads: 0, shows: 0,
    onClose: f => close.add(f), offClose: f => close.delete(f),
    onError: f => error.add(f), offError: f => error.delete(f),
    load() { this.loads += 1; return Promise.resolve(); },
    show() {
      this.shows += 1;
      return behavior(this);
    },
    hide() { this.hidden = true; },
    fire(res) { [...close].forEach(f => f(res)); },
  };
}

test('看完才发奖', async () => {
  const { ads, events } = kit();
  assert.deepStrictEqual(await ads.showRewarded('revive'), { rewarded: true, reason: null });
  assert.ok(events.some(e => e.type === 'ad_reward'));
});

test('中途关闭不发奖', async () => {
  const { ads, events } = kit({ mock: { completed: false } });
  const r = await ads.showRewarded('revive');
  assert.strictEqual(r.rewarded, false);
  assert.strictEqual(r.reason, 'not_finished');
  assert.ok(!events.some(e => e.type === 'ad_reward'));
});

test('没有广告时不发奖，也不报错', async () => {
  const { ads } = kit({ mock: { fill: false } });
  assert.deepStrictEqual(await ads.showRewarded('revive'), { rewarded: false, reason: 'no_fill' });
});

test('平台抛错时游戏不会崩', async () => {
  const provider = Object.assign(AdKit.mockProvider(), { showRewarded: () => Promise.reject(new Error('boom')) });
  const { ads } = kit({ provider });
  assert.deepStrictEqual(await ads.showRewarded('revive'), { rewarded: false, reason: 'provider_error' });
  assert.strictEqual((await ads.showRewarded('revive')).reason, 'provider_error');
});

test('广告一直不返回时会超时，之后还能继续用', async () => {
  const provider = Object.assign(AdKit.mockProvider(), { showRewarded: () => new Promise(() => {}) });
  const { ads } = kit({ provider, timeoutSec: 0.01 });
  assert.strictEqual((await ads.showRewarded('revive')).reason, 'timeout');
  assert.ok(ads.canShow('revive').ok);
});

test('同一时间只放一个全屏广告', async () => {
  const { ads } = kit({ mock: { delayMs: 5 } });
  const first = ads.showRewarded('revive');
  assert.strictEqual((await ads.showRewarded('double_score')).reason, 'busy');
  assert.strictEqual((await first).rewarded, true);
});

test('插屏：新玩家前几局和开局 60 秒内不放', async () => {
  const { ads, clock } = kit();
  ads.noteRound();
  ads.noteRound();
  ads.noteRound();
  assert.strictEqual(ads.canShow('round_end').reason, 'too_early');
  clock.t += 61000;
  assert.ok(ads.canShow('round_end').ok);
});

test('插屏：每 3 局一次，并有冷却', async () => {
  const { ads, clock } = kit();
  clock.t += 61000;
  for (let i = 0; i < 3; i++) ads.noteRound();
  assert.strictEqual((await ads.showInterstitial('round_end')).shown, true);
  ads.noteRound();
  assert.strictEqual(ads.canShow('round_end').reason, 'not_this_round');
  ads.noteRound();
  ads.noteRound();
  assert.strictEqual(ads.canShow('round_end').reason, 'cooldown');
  clock.t += 121000;
  assert.ok(ads.canShow('round_end').ok);
});

test('每日上限到第二天恢复，重启后也保留', async () => {
  const storage = AdKit.memoryStorage();
  const placements = { revive: { format: 'rewarded', unitId: 'r', maxPerDay: 2 } };
  const first = kit({ storage, placements });
  await first.ads.showRewarded('revive');
  await first.ads.showRewarded('revive');
  assert.strictEqual(first.ads.canShow('revive').reason, 'daily_cap');

  const restarted = kit({ storage, placements });
  assert.strictEqual(restarted.ads.canShow('revive').reason, 'daily_cap');
  restarted.clock.t += DAY;
  assert.ok(restarted.ads.canShow('revive').ok);
});

test('存档损坏时照常运行', () => {
  const { ads } = kit({ storage: { get: () => '{坏数据', set() {} } });
  assert.ok(ads.canShow('revive').ok);
});

test('关闭广告后全部不放', async () => {
  const { ads } = kit();
  ads.setEnabled(false);
  assert.deepStrictEqual(await ads.showRewarded('revive'), { rewarded: false, reason: 'disabled' });
});

test('位置和格式写错时不放', async () => {
  const { ads } = kit();
  assert.strictEqual((await ads.showRewarded('nope')).reason, 'unknown_placement');
  assert.strictEqual((await ads.showInterstitial('revive')).reason, 'wrong_format');
});

test('微信：isEnded 决定是否发奖', async () => {
  for (const [isEnded, expected] of [[true, true], [false, false]]) {
    const ad = fakeAd(self => { setTimeout(() => self.fire({ isEnded })); return Promise.resolve(); });
    const provider = AdKit.wechatProvider({ createRewardedVideoAd: () => ad });
    const { ads } = kit({ provider });
    assert.strictEqual((await ads.showRewarded('revive')).rewarded, expected);
  }
});

test('微信：旧基础库 onClose 不带参数时算看完', async () => {
  const ad = fakeAd(self => { setTimeout(() => self.fire()); return Promise.resolve(); });
  const { ads } = kit({ provider: AdKit.wechatProvider({ createRewardedVideoAd: () => ad }) });
  assert.strictEqual((await ads.showRewarded('revive')).rewarded, true);
});

test('微信：多次观看不会重复发奖', async () => {
  const ad = fakeAd(self => { setTimeout(() => self.fire({ isEnded: true })); return Promise.resolve(); });
  let created = 0;
  const provider = AdKit.wechatProvider({ createRewardedVideoAd: () => { created += 1; return ad; } });
  const { ads, events } = kit({ provider });
  await ads.showRewarded('revive');
  await ads.showRewarded('revive');
  await ads.showRewarded('revive');
  assert.strictEqual(created, 1);
  assert.strictEqual(ad.close.size, 0);
  assert.strictEqual(events.filter(e => e.type === 'ad_reward').length, 3);
});

test('微信：首次失败会重新拉取一次', async () => {
  const ad = fakeAd(self => {
    if (self.shows === 1) return Promise.reject({ errCode: 1004 });
    setTimeout(() => self.fire({ isEnded: true }));
    return Promise.resolve();
  });
  const { ads } = kit({ provider: AdKit.wechatProvider({ createRewardedVideoAd: () => ad }) });
  assert.strictEqual((await ads.showRewarded('revive')).rewarded, true);
  assert.strictEqual(ad.loads, 1);
});

test('微信：重试仍失败时返回无广告', async () => {
  const ad = fakeAd(() => Promise.reject({ errCode: 1004 }));
  const { ads } = kit({ provider: AdKit.wechatProvider({ createRewardedVideoAd: () => ad }) });
  assert.deepStrictEqual(await ads.showRewarded('revive'), { rewarded: false, reason: 'no_fill_1004' });
  assert.strictEqual(ad.close.size, 0);
});

test('微信：基础库不支持时安全跳过', async () => {
  const { ads } = kit({ provider: AdKit.wechatProvider({}) });
  assert.strictEqual((await ads.showRewarded('revive')).reason, 'unsupported');
});

test('微信：横幅用模板广告，可隐藏', async () => {
  const ad = fakeAd(() => Promise.resolve());
  let used = null;
  const wx = { createCustomAd(o) { used = o; return ad; } };
  const { ads } = kit({ provider: AdKit.wechatProvider(wx) });
  assert.strictEqual((await ads.showBanner('menu_banner', { left: 0, top: 0 })).shown, true);
  assert.strictEqual(used.adUnitId, 'b');
  ads.hideBanner('menu_banner');
  assert.strictEqual(ad.hidden, true);
});
