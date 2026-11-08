/*
 * ad-kit：独立的游戏广告模块。
 *
 * 游戏只和 AdKit 打交道，只问“这个位置现在能不能放广告”。
 * 频控、发奖、失败兜底都在这里；具体平台由 provider 决定，换平台不用改游戏代码。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AdKit = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'ad-kit-state';

  function dayKey(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }

  function memoryStorage() {
    let value = null;
    return { get: () => value, set: v => { value = v; } };
  }

  function webStorage() {
    return {
      get() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
      },
      set(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* 无痕模式下可能不可用 */ }
      },
    };
  }

  function wechatStorage(wx) {
    return {
      get() {
        try { return wx.getStorageSync(STORAGE_KEY) || null; } catch (e) { return null; }
      },
      set(v) {
        try { wx.setStorageSync(STORAGE_KEY, v); } catch (e) { /* 写失败只影响频控，不影响游戏 */ }
      },
    };
  }

  /* 微信小游戏适配层。placements 里的 unitId 就是后台申请的广告位 ID。 */
  function wechatProvider(wx) {
    const rewarded = {};
    const interstitial = {};
    const banners = {};

    function play(ad, onDone) {
      return new Promise(resolve => {
        const finish = result => {
          ad.offClose(handleClose);
          ad.offError(handleError);
          resolve(result);
        };
        const handleClose = res => finish(onDone(res));
        const handleError = err => finish({ ok: false, reason: 'error_' + (err && err.errCode) });
        ad.onClose(handleClose);
        ad.onError(handleError);
        ad.show().catch(() =>
          ad.load()
            .then(() => ad.show())
            .catch(err => finish({ ok: false, reason: 'no_fill_' + (err && err.errCode) })));
      });
    }

    return {
      name: 'wechat',
      showRewarded(unitId) {
        if (!wx.createRewardedVideoAd) return Promise.resolve({ ok: false, reason: 'unsupported' });
        rewarded[unitId] = rewarded[unitId] || wx.createRewardedVideoAd({ adUnitId: unitId });
        /* 基础库 2.1.0 之前 onClose 不带参数，且只有看完才能关闭。 */
        return play(rewarded[unitId], res => ({ ok: true, completed: !res || res.isEnded === true }));
      },
      showInterstitial(unitId) {
        if (!wx.createInterstitialAd) return Promise.resolve({ ok: false, reason: 'unsupported' });
        interstitial[unitId] = interstitial[unitId] || wx.createInterstitialAd({ adUnitId: unitId });
        return play(interstitial[unitId], () => ({ ok: true }));
      },
      showBanner(unitId, style) {
        const create = wx.createCustomAd || wx.createBannerAd;
        if (!create) return Promise.resolve({ ok: false, reason: 'unsupported' });
        banners[unitId] = banners[unitId] || create.call(wx, { adUnitId: unitId, style: style || {} });
        return Promise.resolve(banners[unitId].show())
          .then(() => ({ ok: true }))
          .catch(err => ({ ok: false, reason: 'no_fill_' + (err && err.errCode) }));
      },
      hideBanner(unitId) {
        if (banners[unitId]) banners[unitId].hide();
      },
    };
  }

  /* 没有真实广告时使用：开发、测试和演示都走这里。 */
  function mockProvider(options) {
    const o = Object.assign({ fill: true, completed: true, delayMs: 0 }, options);
    const wait = value => new Promise(resolve => setTimeout(() => resolve(value), o.delayMs));
    return {
      name: 'mock',
      showRewarded: () => wait(o.fill ? { ok: true, completed: o.completed } : { ok: false, reason: 'no_fill' }),
      showInterstitial: () => wait(o.fill ? { ok: true } : { ok: false, reason: 'no_fill' }),
      showBanner: () => Promise.resolve(o.fill ? { ok: true } : { ok: false, reason: 'no_fill' }),
      hideBanner() {},
    };
  }

  function create(config) {
    const provider = config.provider;
    const placements = config.placements;
    const storage = config.storage || memoryStorage();
    const now = config.now || (() => Date.now());
    const onEvent = config.onEvent || (() => {});
    const timeoutMs = (config.timeoutSec || 90) * 1000;
    const interstitialGapMs = (config.interstitialGapSec || 60) * 1000;

    let enabled = true;
    let busy = false;
    let rounds = 0;
    const sessionStart = now();
    const sessionShows = {};
    const visibleBanners = {};
    let state = load();

    function load() {
      try {
        return Object.assign({ day: '', daily: {}, lastShown: {}, lastInterstitial: 0 },
          JSON.parse(storage.get() || '{}'));
      } catch (e) {
        return { day: '', daily: {}, lastShown: {}, lastInterstitial: 0 };
      }
    }

    function rollDay() {
      const today = dayKey(now());
      if (state.day !== today) {
        state.day = today;
        state.daily = {};
      }
    }

    function emit(type, placement, extra) {
      try {
        onEvent(Object.assign({ type, placement, provider: provider.name }, extra));
      } catch (e) { /* 统计出错不能影响游戏 */ }
    }

    function canShow(name) {
      const p = placements[name];
      if (!p) return { ok: false, reason: 'unknown_placement' };
      if (!enabled) return { ok: false, reason: 'disabled' };
      if (busy && p.format !== 'banner') return { ok: false, reason: 'busy' };
      rollDay();
      const t = now();
      if (p.minSessionSec && t - sessionStart < p.minSessionSec * 1000) return { ok: false, reason: 'too_early' };
      if (p.skipRounds && rounds <= p.skipRounds) return { ok: false, reason: 'too_early' };
      if (p.everyRounds && rounds % p.everyRounds !== 0) return { ok: false, reason: 'not_this_round' };
      if (p.cooldownSec && t - (state.lastShown[name] || 0) < p.cooldownSec * 1000) return { ok: false, reason: 'cooldown' };
      if (p.format === 'interstitial' && t - state.lastInterstitial < interstitialGapMs) return { ok: false, reason: 'cooldown' };
      if (p.maxPerDay && (state.daily[name] || 0) >= p.maxPerDay) return { ok: false, reason: 'daily_cap' };
      if (p.maxPerSession && (sessionShows[name] || 0) >= p.maxPerSession) return { ok: false, reason: 'session_cap' };
      return { ok: true };
    }

    function record(name) {
      const t = now();
      rollDay();
      state.daily[name] = (state.daily[name] || 0) + 1;
      state.lastShown[name] = t;
      if (placements[name].format === 'interstitial') state.lastInterstitial = t;
      sessionShows[name] = (sessionShows[name] || 0) + 1;
      storage.set(JSON.stringify(state));
    }

    function withTimeout(promise) {
      return new Promise(resolve => {
        const timer = setTimeout(() => resolve({ ok: false, reason: 'timeout' }), timeoutMs);
        Promise.resolve(promise)
          .catch(() => ({ ok: false, reason: 'provider_error' }))
          .then(result => {
            clearTimeout(timer);
            resolve(result);
          });
      });
    }

    function fullscreen(name, format, method) {
      const p = placements[name];
      if (p && p.format !== format) return Promise.resolve({ ok: false, reason: 'wrong_format' });
      const check = canShow(name);
      if (!check.ok) {
        emit('ad_blocked', name, { reason: check.reason });
        return Promise.resolve(check);
      }
      busy = true;
      emit('ad_request', name);
      return withTimeout(provider[method](p.unitId)).then(result => {
        busy = false;
        if (result.ok) {
          record(name);
          emit('ad_shown', name);
        } else {
          emit('ad_failed', name, { reason: result.reason });
        }
        return result;
      });
    }

    return {
      canShow,
      /* 每结束一局调用一次，插屏按局数判断。 */
      noteRound() { rounds += 1; },
      /* 用户买了去广告，或你想关闭广告时调用。 */
      setEnabled(value) {
        enabled = Boolean(value);
        if (enabled) return;
        Object.keys(visibleBanners).forEach(name => {
          provider.hideBanner(placements[name].unitId);
          delete visibleBanners[name];
        });
      },
      /* 永远不会 reject。只有 rewarded 为 true 才能发奖。 */
      showRewarded(name) {
        return fullscreen(name, 'rewarded', 'showRewarded').then(result => {
          const rewarded = result.ok === true && result.completed === true;
          if (rewarded) emit('ad_reward', name);
          else if (result.ok) emit('ad_skipped', name);
          return { rewarded, reason: rewarded ? null : (result.reason || 'not_finished') };
        });
      },
      showInterstitial(name) {
        return fullscreen(name, 'interstitial', 'showInterstitial').then(result => ({
          shown: result.ok === true,
          reason: result.ok ? null : result.reason,
        }));
      },
      showBanner(name, style) {
        const p = placements[name];
        if (p && p.format !== 'banner') return Promise.resolve({ shown: false, reason: 'wrong_format' });
        const check = canShow(name);
        if (!check.ok) return Promise.resolve({ shown: false, reason: check.reason });
        return withTimeout(provider.showBanner(p.unitId, style)).then(result => {
          if (result.ok) {
            visibleBanners[name] = true;
            record(name);
            emit('ad_shown', name);
          } else {
            emit('ad_failed', name, { reason: result.reason });
          }
          return { shown: result.ok === true, reason: result.ok ? null : result.reason };
        });
      },
      hideBanner(name) {
        const p = placements[name];
        if (p) provider.hideBanner(p.unitId);
        delete visibleBanners[name];
      },
    };
  }

  /* 建议的默认位置和频率。上线后按数据调整。 */
  function recommendedPlacements(ids) {
    return {
      revive: { format: 'rewarded', unitId: ids.rewarded, maxPerSession: 10, maxPerDay: 30 },
      double_score: { format: 'rewarded', unitId: ids.rewarded, maxPerDay: 30 },
      round_end: { format: 'interstitial', unitId: ids.interstitial, skipRounds: 2, everyRounds: 3, minSessionSec: 60, cooldownSec: 120, maxPerDay: 15 },
      menu_banner: { format: 'banner', unitId: ids.banner },
    };
  }

  return { create, wechatProvider, mockProvider, webStorage, wechatStorage, memoryStorage, recommendedPlacements };
});
