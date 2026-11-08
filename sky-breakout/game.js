/* 云霄突围：竖屏飞机射击。界面全部画在 canvas 上，方便以后移植到微信小游戏。 */
const VW = 400;
let VH = 720;
let uiY = 0;
const TAU = Math.PI * 2;
const FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
const SAVE_KEY = 'sky-breakout-save';

const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

let scale = 1;
let offX = 0;
let offY = 0;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  /* 长屏手机把游戏区域拉高，避免上下留黑边。 */
  VH = Math.max(720, Math.min(900, VW * h / w));
  uiY = (VH - 720) / 2;
  scale = Math.min(w / VW, h / VH);
  offX = (w - VW * scale) / 2;
  offY = (h - VH * scale) / 2;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
}

function loadSave() {
  const base = { best: 0, coins: 0, hull: 0, fire: 0, luck: 0 };
  try {
    return Object.assign(base, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'));
  } catch (e) {
    return base;
  }
}
function writeSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* 无痕模式下可能不可用 */ }
}
const save = loadSave();

const HANGAR = [
  { id: 'hull', name: '加固机身', desc: '开局生命 +1', max: 3, cost: lv => [150, 400, 900][lv] },
  { id: 'fire', name: '火控升级', desc: '子弹伤害 +10%', max: 5, cost: lv => 120 * (lv + 1) * (lv + 1) },
  { id: 'luck', name: '战利品', desc: '金币收益 +20%', max: 5, cost: lv => 100 * (lv + 1) * (lv + 1) },
];

const UPGRADES = [
  { id: 'spread', name: '散射', desc: '多一列子弹', max: 4, apply: s => { s.spread += 1; } },
  { id: 'rate', name: '速射', desc: '射速 +20%', max: 5, apply: s => { s.rate *= 1.2; } },
  { id: 'power', name: '重弹', desc: '伤害 +30%', max: 5, apply: s => { s.dmg *= 1.3; } },
  { id: 'pierce', name: '穿甲', desc: '子弹多穿透 1 个敌人', max: 2, apply: s => { s.pierce += 1; } },
  { id: 'wing', name: '僚机', desc: '多一架僚机一起开火', max: 2, apply: s => { s.wing += 1; } },
  { id: 'homing', name: '追踪弹', desc: '定时发射追踪导弹', max: 3, apply: s => { s.homing += 1; } },
  { id: 'magnet', name: '磁吸', desc: '吸取经验的范围变大', max: 3, apply: s => { s.magnet += 60; } },
  { id: 'shield', name: '护盾', desc: '抵挡一次伤害', max: 99, apply: s => { s.shield += 1; } },
  { id: 'repair', name: '维修', desc: '恢复 1 点生命', max: 99, apply: s => { s.hp = Math.min(s.maxHp, s.hp + 1); } },
];

const ENEMIES = {
  scout: { hp: 2, r: 14, score: 10, gems: 1, color: '#ff7a59' },
  weaver: { hp: 3, r: 14, score: 15, gems: 1, color: '#ffb347' },
  diver: { hp: 3, r: 13, score: 20, gems: 1, color: '#f25f9a' },
  gunner: { hp: 12, r: 21, score: 50, gems: 3, color: '#b983ff' },
};

const G = {
  mode: 'menu', paused: false, ad: null, bannerOn: false, busy: false,
  t: 0, score: 0, kills: 0, bossKills: 0, level: 1, xp: 0, pendingPicks: 0,
  p: null, shots: [], foes: [], foeShots: [], gems: [], fx: [], texts: [], boss: null,
  spawnT: 0, nextBoss: 60, bossCount: 0, fireT: 0, wingT: 0, missileT: 0,
  shake: 0, choices: [], picked: {}, reviveUsed: false, doubled: false,
  earned: 0, isRecord: false, buttons: [], clouds: [], islands: [], keys: {}, sky: 0, cam: 0,
};

const GROUND = 90;
const GROUND_SPEED = 90;
const CLOUD_SPEED = 150;

function makeIsland(v) {
  const r = 50 + Math.random() * 90;
  const radii = [];
  for (let i = 0; i < 9; i++) radii.push(r * (0.7 + Math.random() * 0.5));
  return { x: -250 + Math.random() * 900, v, radii };
}

function makeCloud(v, high) {
  return { x: -150 + Math.random() * 700, v, r: 34 + Math.random() * 46, z: high ? 46 : -34, high };
}

for (let i = 0; i < 7; i++) G.islands.push(makeIsland(Math.random() * 1500));
for (let i = 0; i < 9; i++) G.clouds.push(makeCloud(Math.random() * 1500, i < 2));

function fakeAd(rewarded) {
  return new Promise(resolve => { G.ad = { left: 2, rewarded, resolve }; });
}

const demoProvider = {
  name: 'demo',
  showRewarded: () => fakeAd(true),
  showInterstitial: () => fakeAd(false),
  showBanner: () => { G.bannerOn = true; return Promise.resolve({ ok: true }); },
  hideBanner: () => { G.bannerOn = false; },
};

/* 拿到微信广告位 ID 后填在这里。 */
const AD_UNITS = { rewarded: 'your-rewarded-id', interstitial: 'your-interstitial-id', banner: 'your-banner-id' };

const onWechat = typeof wx !== 'undefined' && wx.createRewardedVideoAd;
const ads = AdKit.create({
  provider: onWechat ? AdKit.wechatProvider(wx) : demoProvider,
  storage: onWechat ? AdKit.wechatStorage(wx) : AdKit.webStorage(),
  placements: {
    revive: { format: 'rewarded', unitId: AD_UNITS.rewarded, maxPerDay: 30 },
    double_coins: { format: 'rewarded', unitId: AD_UNITS.rewarded, maxPerDay: 30 },
    take_all: { format: 'rewarded', unitId: AD_UNITS.rewarded, maxPerDay: 30 },
    round_end: { format: 'interstitial', unitId: AD_UNITS.interstitial, skipRounds: 2, everyRounds: 3, minSessionSec: 60, cooldownSec: 120, maxPerDay: 15 },
    menu_banner: { format: 'banner', unitId: AD_UNITS.banner },
  },
});

function goMenu() {
  G.mode = 'menu';
  ads.showBanner('menu_banner');
}

function start() {
  ads.hideBanner('menu_banner');
  Object.assign(G, {
    mode: 'play', paused: false, t: 0, score: 0, kills: 0, bossKills: 0, level: 1, xp: 0, pendingPicks: 0,
    shots: [], foes: [], foeShots: [], gems: [], fx: [], texts: [], boss: null,
    spawnT: 1, nextBoss: 60, bossCount: 0, fireT: 0, wingT: 0, missileT: 0, shake: 0,
    choices: [], picked: {}, reviveUsed: false, doubled: false, earned: 0, isRecord: false,
  });
  const hp = 3 + save.hull;
  G.p = {
    x: VW / 2, y: VH - 110, lastX: VW / 2, bank: 0, hp, maxHp: hp, inv: 1, shield: 0,
    spread: 1, rate: 5, dmg: 1 + save.fire * 0.1, pierce: 0, wing: 0, homing: 0, magnet: 120,
  };
}

function enemyHp(base) {
  const k = G.t;
  return base * (1 + k / 60 + (k / 90) * (k / 90) + Math.pow(k / 130, 3));
}

function addFoe(kind, x, y, extra) {
  const d = ENEMIES[kind];
  G.foes.push(Object.assign({ kind, x, y, hp: enemyHp(d.hp), r: d.r, age: 0, flash: 0, shotT: 1.2 }, extra));
}

function spawnWave() {
  const t = G.t;
  const roll = Math.random();
  if (t > 35 && roll < 0.22 + Math.min(t / 600, 0.25)) {
    addFoe('gunner', 70 + Math.random() * (VW - 140), -30);
  } else if (t > 18 && roll < 0.45) {
    const left = Math.random() < 0.5;
    for (let i = 0; i < 2; i++) addFoe('diver', left ? 70 + i * 60 : VW - 70 - i * 60, -30 - i * 50);
  } else if (roll < 0.72) {
    const baseX = 80 + Math.random() * (VW - 160);
    for (let i = 0; i < 5; i++) addFoe('weaver', baseX, -30 - i * 42, { baseX, phase: i * 0.5 });
  } else {
    const n = 3 + Math.floor(Math.random() * 3);
    const gap = (VW - 80) / (n - 1);
    for (let i = 0; i < n; i++) addFoe('scout', 40 + i * gap, -30 - (i % 2) * 28);
  }
}

function spawnBoss() {
  G.bossCount += 1;
  const n = G.bossCount;
  const hp = 120 * n * n * (1 + G.t / 240);
  G.boss = { x: VW / 2, y: -70, hp, maxHp: hp, r: 62, age: 0, flash: 0, attackT: 1.6, pattern: 0, spiral: 0, spiralT: 0, angle: 0 };
  G.texts.push({ text: '警告：敌方旗舰', x: VW / 2, y: 240, life: 1.6, color: '#ff5d6c', size: 26 });
  sound(150, 0.4, 'sawtooth', 0.06);
}

function bulletSpeed() { return Math.min(150 + G.t * 0.6, 400); }

/* 150 秒后的加压系数：撑得越久敌人火力越猛，避免滚雪球后永远死不了。 */
function pressure() { return Math.max(0, (G.t - 150) / 100); }

function foeShot(x, y, angle, speed) {
  if (G.foeShots.length >= 220) return;
  G.foeShots.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
}

function aimAt(x, y) { return Math.atan2(G.p.y - y, G.p.x - x); }

function fire(dt) {
  const p = G.p;
  G.fireT -= dt;
  if (G.fireT <= 0) {
    G.fireT += 1 / p.rate;
    for (let i = 0; i < p.spread; i++) {
      const k = i - (p.spread - 1) / 2;
      const a = -Math.PI / 2 + k * 0.11;
      G.shots.push({ x: p.x + k * 8, y: p.y - 22, vx: Math.cos(a) * 620, vy: Math.sin(a) * 620, dmg: p.dmg, pierce: p.pierce, hits: [] });
    }
    sound(760, 0.03, 'square', 0.012);
  }
  if (p.wing > 0) {
    G.wingT -= dt;
    if (G.wingT <= 0) {
      G.wingT += 1.4 / p.rate;
      wingPositions().forEach(([x, y]) => {
        G.shots.push({ x, y: y - 10, vx: 0, vy: -620, dmg: p.dmg * 0.7, pierce: p.pierce, hits: [] });
      });
    }
  }
  if (p.homing > 0) {
    G.missileT -= dt;
    if (G.missileT <= 0) {
      G.missileT += 1.8 / p.homing;
      G.shots.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 300, vy: -200, dmg: p.dmg * 4, pierce: 0, hits: [], homing: true });
    }
  }
}

function wingPositions() {
  const p = G.p;
  const out = [[p.x - 38, p.y + 14]];
  if (p.wing > 1) out.push([p.x + 38, p.y + 14]);
  return out;
}

function nearestTarget(x, y) {
  let best = G.boss;
  let bestD = best ? Math.hypot(best.x - x, best.y - y) : Infinity;
  for (const f of G.foes) {
    const d = Math.hypot(f.x - x, f.y - y);
    if (d < bestD && f.y > 0) { best = f; bestD = d; }
  }
  return best;
}

function hurt() {
  const p = G.p;
  if (p.inv > 0) return;
  if (p.shield > 0) {
    p.shield -= 1;
    p.inv = 0.9;
    burst(p.x, p.y, '#5ce1e6', 14, 140);
    sound(500, 0.12, 'triangle', 0.06);
    return;
  }
  p.hp -= 1;
  p.inv = 1.5;
  G.shake = 12;
  burst(p.x, p.y, '#ff5d6c', 18, 170);
  sound(130, 0.22, 'sawtooth', 0.08);
  if (p.hp <= 0) onDeath();
}

function onDeath() {
  burst(G.p.x, G.p.y, '#ffffff', 40, 260);
  if (!G.reviveUsed && ads.canShow('revive').ok) G.mode = 'dead';
  else finish();
}

function revive() {
  const p = G.p;
  G.reviveUsed = true;
  p.hp = Math.min(p.maxHp, 2);
  p.inv = 3;
  G.foeShots = [];
  G.mode = 'play';
}

function finish() {
  G.earned = Math.round((G.kills + G.bossKills * 40 + G.score / 100) * (1 + save.luck * 0.2));
  save.coins += G.earned;
  G.isRecord = G.score > save.best;
  if (G.isRecord) save.best = G.score;
  writeSave();
  ads.noteRound();
  G.mode = 'result';
}

function burst(x, y, color, n, power) {
  if (G.fx.length > 240) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const v = power * (0.3 + Math.random());
    G.fx.push({ x, y, z: 0, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: (Math.random() - 0.3) * power, life: 0.35 + Math.random() * 0.35, color });
  }
}

function dropGems(x, y, n) {
  for (let i = 0; i < n; i++) {
    G.gems.push({ x: x + (Math.random() - 0.5) * 24, y: y + (Math.random() - 0.5) * 24, vy: 70 });
  }
}

function killFoe(f) {
  const d = ENEMIES[f.kind];
  f.dead = true;
  G.kills += 1;
  G.score += d.score;
  dropGems(f.x, f.y, d.gems);
  burst(f.x, f.y, d.color, 12, 150);
  sound(210, 0.07, 'triangle', 0.035);
}

function killBoss() {
  const b = G.boss;
  G.boss = null;
  G.bossKills += 1;
  G.score += 500 * G.bossCount;
  G.foeShots = [];
  G.nextBoss = G.t + 70;
  G.shake = 16;
  for (let i = 0; i < 4; i++) burst(b.x + (Math.random() - 0.5) * 60, b.y + (Math.random() - 0.5) * 40, '#ffd166', 20, 240);
  G.texts.push({ text: '击毁旗舰 +' + 500 * G.bossCount, x: VW / 2, y: 240, life: 1.4, color: '#ffd166', size: 24 });
  sound(90, 0.5, 'sawtooth', 0.09);
  G.xp = xpNeed();
  G.p.shield += 1;
}

function xpNeed() { return Math.round(3 + G.level * 2 + G.level * G.level * 0.12); }

function rollChoices() {
  const p = G.p;
  const pool = UPGRADES.filter(u => {
    if (u.id === 'repair') return p.hp < p.maxHp;
    if (u.id === 'shield') return p.shield < 1;
    return (G.picked[u.id] || 0) < u.max;
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  G.choices = pool.slice(0, 3);
}

function pick(u) {
  u.apply(G.p);
  G.picked[u.id] = (G.picked[u.id] || 0) + 1;
  G.p.inv = Math.max(G.p.inv, 0.6);
  G.mode = 'play';
  sound(660, 0.12, 'sine', 0.06);
}

function takeAll() {
  for (const u of G.choices) {
    u.apply(G.p);
    G.picked[u.id] = (G.picked[u.id] || 0) + 1;
  }
  G.p.inv = Math.max(G.p.inv, 0.6);
  G.mode = 'play';
  sound(880, 0.2, 'sine', 0.07);
}

function updateBoss(dt) {
  const b = G.boss;
  if (!b) return;
  b.age += dt;
  b.flash = Math.max(0, b.flash - dt * 6);
  b.y += (120 - b.y) * Math.min(1, dt * 1.8);
  b.x = VW / 2 + Math.sin(b.age * 0.8) * 110;
  if (b.age < 1.6) return;

  if (b.spiral > 0) {
    b.spiral -= dt;
    b.spiralT -= dt;
    if (b.spiralT <= 0) {
      b.spiralT = 0.075;
      b.angle += 0.42;
      foeShot(b.x, b.y, b.angle, bulletSpeed() * 0.8);
      foeShot(b.x, b.y, b.angle + Math.PI, bulletSpeed() * 0.8);
    }
    return;
  }
  b.attackT -= dt;
  if (b.attackT > 0) return;
  b.attackT = Math.max(1.3, 2.3 - G.bossCount * 0.15);
  const speed = bulletSpeed();
  if (b.pattern === 0) {
    const n = 14 + G.bossCount * 3;
    const gapStart = Math.random() * TAU;
    for (let i = 0; i < n; i++) foeShot(b.x, b.y, gapStart + (i / n) * TAU, speed * 0.85);
  } else if (b.pattern === 1) {
    const a = aimAt(b.x, b.y);
    for (let i = -2; i <= 2; i++) foeShot(b.x, b.y, a + i * 0.2, speed);
  } else {
    b.spiral = 1.1;
  }
  b.pattern = (b.pattern + 1) % 3;
}

function updateFoes(dt) {
  const p = G.p;
  for (const f of G.foes) {
    f.age += dt;
    f.flash = Math.max(0, f.flash - dt * 6);
    if (f.kind === 'scout') {
      f.y += 130 * dt;
    } else if (f.kind === 'weaver') {
      f.y += 115 * dt;
      f.x = f.baseX + Math.sin(f.age * 2.4 + f.phase) * 62;
    } else if (f.kind === 'diver') {
      if (f.age < 0.9) {
        f.y += 120 * dt;
      } else {
        if (!f.dive) f.dive = aimAt(f.x, f.y);
        f.x += Math.cos(f.dive) * 300 * dt;
        f.y += Math.sin(f.dive) * 300 * dt;
      }
    } else if (f.kind === 'gunner') {
      if (f.y < 130) f.y += 70 * dt;
      else f.y += 12 * dt;
      f.shotT -= dt;
      if (f.shotT <= 0 && f.y > 0) {
        f.shotT = Math.max(0.8, 1.7 - pressure() * 0.25);
        const a = aimAt(f.x, f.y);
        const side = 1 + Math.min(2, Math.floor(pressure()));
        for (let i = -side; i <= side; i++) foeShot(f.x, f.y, a + i * 0.2, bulletSpeed());
      }
    }
    if (G.t > 100 && f.kind !== 'gunner' && (!f.fired || pressure() > 0) && f.y > 90 && f.y < 420 && Math.random() < dt * (0.7 + pressure() * 0.5)) {
      f.fired = true;
      foeShot(f.x, f.y, aimAt(f.x, f.y), bulletSpeed());
    }
    if (Math.hypot(f.x - p.x, f.y - p.y) < f.r + 8) {
      hurt();
      if (G.mode !== 'play') return;
      f.hp -= 6;
      if (f.hp <= 0 && !f.dead) killFoe(f);
    }
  }
  G.foes = G.foes.filter(f => !f.dead && f.y < VH + 50 && f.x > -60 && f.x < VW + 60);
}

function updateShots(dt) {
  for (const s of G.shots) {
    if (s.homing) {
      const target = nearestTarget(s.x, s.y);
      if (target) {
        const a = Math.atan2(target.y - s.y, target.x - s.x);
        s.vx += Math.cos(a) * 1500 * dt;
        s.vy += Math.sin(a) * 1500 * dt;
        const v = Math.hypot(s.vx, s.vy);
        if (v > 460) { s.vx *= 460 / v; s.vy *= 460 / v; }
      }
    }
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    for (const f of G.foes) {
      if (f.dead || s.hits.includes(f)) continue;
      if (Math.hypot(f.x - s.x, f.y - s.y) < f.r + 5) {
        f.hp -= s.dmg;
        f.flash = 1;
        s.hits.push(f);
        if (f.hp <= 0) killFoe(f);
        if (s.pierce-- <= 0) { s.dead = true; break; }
      }
    }
    const b = G.boss;
    if (!s.dead && b && !s.hits.includes(b) && b.y > 0 && Math.hypot(b.x - s.x, b.y - s.y) < b.r + 5) {
      b.hp -= s.dmg;
      b.flash = 1;
      s.dead = true;
      G.score += 1;
      if (b.hp <= 0) killBoss();
    }
  }
  G.shots = G.shots.filter(s => !s.dead && s.y > -30 && s.y < VH + 30 && s.x > -30 && s.x < VW + 30);
  G.foes = G.foes.filter(f => !f.dead);
}

function updateFoeShots(dt) {
  const p = G.p;
  for (const s of G.foeShots) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (Math.hypot(s.x - p.x, s.y - p.y) < 10) {
      s.dead = true;
      hurt();
      if (G.mode !== 'play') return;
    }
  }
  G.foeShots = G.foeShots.filter(s => !s.dead && s.y > -20 && s.y < VH + 20 && s.x > -20 && s.x < VW + 20);
}

function updateGems(dt) {
  const p = G.p;
  for (const g of G.gems) {
    const d = Math.hypot(p.x - g.x, p.y - g.y);
    if (d < p.magnet) {
      const v = 420 * dt / Math.max(d, 1);
      g.x += (p.x - g.x) * Math.min(v, 1);
      g.y += (p.y - g.y) * Math.min(v, 1);
    } else {
      g.y += g.vy * dt;
    }
    if (d < 20) {
      g.dead = true;
      G.xp += 1;
      sound(990, 0.03, 'sine', 0.015);
    }
  }
  G.gems = G.gems.filter(g => !g.dead && g.y < VH + 20);
  if (G.xp >= xpNeed()) {
    G.xp -= xpNeed();
    G.level += 1;
    rollChoices();
    if (G.choices.length > 0) G.mode = 'pick';
  }
}

function movePlayer(dt) {
  const p = G.p;
  const k = G.keys;
  const dx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
  const dy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
  p.x += dx * 300 * dt;
  p.y += dy * 300 * dt;
  p.x = Math.max(16, Math.min(VW - 16, p.x));
  p.y = Math.max(60, Math.min(VH - 30, p.y));
}

function step(dt) {
  G.shake = Math.max(0, G.shake - dt * 40);
  G.sky += dt;
  G.islands.forEach((isle, i) => {
    isle.v -= GROUND_SPEED * dt;
    if (isle.v < -220) G.islands[i] = makeIsland(VH * 1.9 + Math.random() * 300);
  });
  G.clouds.forEach((c, i) => {
    c.v -= CLOUD_SPEED * dt;
    if (c.v < -160) G.clouds[i] = makeCloud(VH * 1.9 + Math.random() * 300, c.high);
  });
  for (const f of G.fx) {
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    f.z += f.vz * dt;
    f.life -= dt;
  }
  G.fx = G.fx.filter(f => f.life > 0);
  for (const t of G.texts) {
    t.y -= 26 * dt;
    t.life -= dt;
  }
  G.texts = G.texts.filter(t => t.life > 0);

  if (G.ad) {
    G.ad.left -= dt;
    if (G.ad.left <= 0) closeAd(true);
    return;
  }
  if (G.mode !== 'play' || G.paused) return;

  const p = G.p;
  G.t += dt;
  p.inv = Math.max(0, p.inv - dt);
  movePlayer(dt);
  const drift = dt > 0 ? (p.x - p.lastX) / dt : 0;
  p.lastX = p.x;
  const targetBank = Math.max(-1, Math.min(1, drift / 320)) * 0.75;
  p.bank += (targetBank - p.bank) * Math.min(1, dt * 10);
  G.cam += ((p.x - VW / 2) * 0.14 - G.cam) * Math.min(1, dt * 4);
  fire(dt);

  if (!G.boss && G.t >= G.nextBoss) spawnBoss();
  if (!G.boss) {
    G.spawnT -= dt;
    if (G.spawnT <= 0) {
      G.spawnT = Math.max(0.55 - Math.min(pressure(), 2) * 0.1, 2.1 - G.t / 70);
      spawnWave();
    }
  }
  updateBoss(dt);
  updateFoes(dt);
  if (G.mode !== 'play') return;
  updateShots(dt);
  updateFoeShots(dt);
  if (G.mode !== 'play') return;
  updateGems(dt);
}

function closeAd(completed) {
  const ad = G.ad;
  G.ad = null;
  ad.resolve(ad.rewarded ? { ok: true, completed } : { ok: true });
}

async function watchTakeAll() {
  if (G.busy) return;
  G.busy = true;
  const r = await ads.showRewarded('take_all');
  G.busy = false;
  if (r.rewarded) takeAll();
}

async function watchRevive() {
  if (G.busy) return;
  G.busy = true;
  const r = await ads.showRewarded('revive');
  G.busy = false;
  if (r.rewarded) revive();
  else finish();
}

async function watchDouble() {
  if (G.busy || G.doubled) return;
  G.busy = true;
  const r = await ads.showRewarded('double_coins');
  G.busy = false;
  if (r.rewarded) {
    G.doubled = true;
    save.coins += G.earned;
    G.earned *= 2;
    writeSave();
  }
}

async function playAgain() {
  if (G.busy) return;
  G.busy = true;
  await ads.showInterstitial('round_end');
  G.busy = false;
  start();
}

function buy(item) {
  const lv = save[item.id];
  if (lv >= item.max) return;
  const cost = item.cost(lv);
  if (save.coins < cost) return;
  save.coins -= cost;
  save[item.id] = lv + 1;
  writeSave();
  sound(660, 0.12, 'sine', 0.06);
}

/* ---------- 绘制 ---------- */

function text(str, x, y, size, color, align, weight) {
  ctx.font = (weight || 600) + ' ' + size + 'px ' + FONT;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#eef4f8';
  ctx.fillText(str, x, y);
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function button(label, x, y, w, h, onTap, style) {
  const s = style || 'main';
  G.buttons.push({ x, y: y + uiY, w, h, onTap, primary: s === 'main' });
  roundRect(x, y, w, h, 8);
  ctx.fillStyle = s === 'main' ? '#ffd166' : s === 'ad' ? '#1fa7a0' : s === 'off' ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.14)';
  ctx.fill();
  text(label, x + w / 2, y + h / 2 + 1, 18, s === 'main' ? '#20262c' : s === 'off' ? '#7f8c96' : '#ffffff');
}

function line3d(ax, ay, bx, by) {
  const a = R3D.project(ax, ay, -GROUND);
  const b = R3D.project(bx, by, -GROUND);
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
}

function drawGround() {
  const g = ctx.createLinearGradient(0, 0, 0, VH);
  g.addColorStop(0, '#5a9db5');
  g.addColorStop(0.28, '#2b7490');
  g.addColorStop(1, '#0d3d57');
  ctx.fillStyle = g;
  ctx.fillRect(-20, -20, VW + 40, VH + 40);

  ctx.strokeStyle = 'rgba(255,255,255,.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const gap = 110;
  const off = (G.sky * GROUND_SPEED) % gap;
  for (let v = -off; v < VH * 2.2; v += gap) line3d(-1100, VH - v, 1500, VH - v);
  for (let x = -1100; x <= 1500; x += gap) line3d(x, VH + 170, x, -VH * 1.2);
  ctx.stroke();

  for (const isle of G.islands) drawIsland(isle);
}

function islandShape(isle, grow, z) {
  const y = VH - isle.v;
  ctx.beginPath();
  isle.radii.forEach((r, i) => {
    const a = i / isle.radii.length * TAU;
    const p = R3D.project(isle.x + Math.cos(a) * r * grow, y + Math.sin(a) * r * grow, z);
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  });
  ctx.closePath();
  ctx.fill();
}

function drawIsland(isle) {
  ctx.fillStyle = '#b9a873';
  islandShape(isle, 1.08, -GROUND);
  ctx.fillStyle = '#2d7558';
  islandShape(isle, 0.94, -GROUND + 5);
  ctx.fillStyle = '#3f9570';
  islandShape(isle, 0.6, -GROUND + 18);
  ctx.fillStyle = '#5bb285';
  islandShape(isle, 0.28, -GROUND + 32);
}

function ellipse(x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(rx, 0.1), Math.max(ry, 0.1), 0, 0, TAU);
  ctx.fill();
}

function drawCloud(c) {
  const y = VH - c.v;
  const p = R3D.project(c.x, y, c.z);
  const q = R3D.project(c.x + c.r * 0.9, y + 8, c.z);
  const r = R3D.project(c.x - c.r * 0.8, y + 6, c.z);
  ctx.fillStyle = c.high ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.16)';
  ellipse(p[0], p[1], c.r * p[2], c.r * 0.5 * p[2]);
  ellipse(q[0], q[1], c.r * 0.7 * q[2], c.r * 0.36 * q[2]);
  ellipse(r[0], r[1], c.r * 0.6 * r[2], c.r * 0.32 * r[2]);
}

function shadow(x, y, size) {
  const p = R3D.project(x + 18, y, -GROUND);
  ctx.fillStyle = 'rgba(4,20,32,.3)';
  ellipse(p[0], p[1], size * p[2], size * 0.42 * p[2]);
}

function drawJet(x, y, s, bank) {
  R3D.drawMesh(R3D.meshes.player, x, y, 0, { s, roll: bank, pitch: 0.06 });
  const flame = R3D.project(x, y + 26 * s, 0);
  ctx.fillStyle = 'rgba(255,170,70,.85)';
  ellipse(flame[0], flame[1] + 2 * s, 3.5 * s * flame[2], (7 + Math.random() * 5) * s * flame[2]);
  ctx.fillStyle = 'rgba(255,240,200,.95)';
  ellipse(flame[0], flame[1], 1.8 * s * flame[2], 4 * s * flame[2]);
}

function drawPlayer() {
  const p = G.p;
  if (p.inv > 0 && Math.floor(G.sky * 14) % 2 === 0) ctx.globalAlpha = 0.5;
  if (p.wing > 0) wingPositions().forEach(([x, y]) => drawJet(x, y, 0.55, p.bank));
  drawJet(p.x, p.y, 1, p.bank);
  ctx.globalAlpha = 1;
  const c = R3D.project(p.x, p.y, 0);
  ctx.fillStyle = '#ff3d5e';
  ellipse(c[0], c[1], 3.6, 3.6);
  ctx.fillStyle = '#ffffff';
  ellipse(c[0], c[1], 1.5, 1.5);
  if (p.shield > 0) {
    ctx.strokeStyle = 'rgba(92,225,230,.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(c[0], c[1], 34 * c[2], 24 * c[2], 0, 0, TAU);
    ctx.stroke();
  }
}

function drawFoe(f) {
  const o = { s: f.kind === 'gunner' ? 1 : f.r / 14 * 1.3, yaw: Math.PI, flash: f.flash > 0 };
  if (f.kind === 'weaver') o.roll = Math.cos(f.age * 2.4 + f.phase) * 0.7;
  if (f.kind === 'diver' && f.dive) o.yaw = -f.dive - Math.PI / 2;
  R3D.drawMesh(R3D.meshes[f.kind], f.x, f.y, 0, o);
}

function drawBoss() {
  const b = G.boss;
  R3D.drawMesh(R3D.meshes.boss, b.x, b.y, 0, { yaw: Math.PI, roll: Math.cos(b.age * 0.8) * 0.16, pitch: 0.05, flash: b.flash > 0 });
}

function drawGem(g) {
  const p = R3D.project(g.x, g.y, 4);
  const w = 5.5 * p[2] * Math.abs(Math.cos(G.sky * 4 + g.x));
  const h = 7.5 * p[2];
  ctx.fillStyle = '#7cf29c';
  ctx.beginPath();
  ctx.moveTo(p[0], p[1] - h);
  ctx.lineTo(p[0] + w + 1, p[1]);
  ctx.lineTo(p[0], p[1] + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c9ffd9';
  ctx.beginPath();
  ctx.moveTo(p[0], p[1] - h);
  ctx.lineTo(p[0] - w - 1, p[1]);
  ctx.lineTo(p[0], p[1] + h);
  ctx.closePath();
  ctx.fill();
}

function drawShot(s) {
  const a = R3D.project(s.x, s.y, 2);
  const b = R3D.project(s.x - s.vx * 0.03, s.y - s.vy * 0.03, 2);
  ctx.strokeStyle = s.homing ? '#ffd166' : '#a7f3ff';
  ctx.lineWidth = (s.homing ? 5 : 4) * a[2];
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.stroke();
}

function drawFoeShot(s) {
  const p = R3D.project(s.x, s.y, 2);
  const r = 8 * p[2];
  ctx.fillStyle = '#ff2f78';
  ellipse(p[0], p[1], r, r);
  ctx.fillStyle = '#ffb0cf';
  ellipse(p[0] - r * 0.15, p[1] - r * 0.2, r * 0.6, r * 0.6);
  ctx.fillStyle = '#ffffff';
  ellipse(p[0] - r * 0.25, p[1] - r * 0.3, r * 0.28, r * 0.28);
}

function drawWorld() {
  G.gems.forEach(drawGem);
  const planes = G.foes.slice();
  if (G.boss) planes.push(G.boss);
  planes.sort((a, b) => a.y - b.y);
  for (const f of planes) {
    if (f === G.boss) drawBoss();
    else drawFoe(f);
  }
  G.shots.forEach(drawShot);
  if (G.mode !== 'dead' && G.p.hp > 0) drawPlayer();
  G.foeShots.forEach(drawFoeShot);
  for (const f of G.fx) {
    const p = R3D.project(f.x, f.y, f.z);
    const r = 3 * p[2];
    ctx.globalAlpha = Math.min(1, f.life * 3);
    ctx.fillStyle = f.color;
    ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

function drawShadows() {
  for (const f of G.foes) shadow(f.x, f.y, f.r * 1.2);
  if (G.boss) shadow(G.boss.x, G.boss.y, 92);
  if (G.mode !== 'dead' && G.p.hp > 0) {
    shadow(G.p.x, G.p.y, 28);
    if (G.p.wing > 0) wingPositions().forEach(([x, y]) => shadow(x, y, 15));
  }
}

function drawTexts() {
  for (const t of G.texts) {
    ctx.globalAlpha = Math.min(1, t.life * 2);
    text(t.text, t.x, t.y, t.size, t.color);
  }
  ctx.globalAlpha = 1;
}

function drawHud() {
  const p = G.p;
  const band = ctx.createLinearGradient(0, 0, 0, 74);
  band.addColorStop(0, 'rgba(6,18,30,.7)');
  band.addColorStop(1, 'rgba(6,18,30,0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, VW, 74);
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  ctx.fillRect(0, 0, VW, 5);
  ctx.fillStyle = '#7cf29c';
  ctx.fillRect(0, 0, VW * Math.min(1, G.xp / xpNeed()), 5);
  text(String(G.score), VW / 2, 30, 26, '#ffffff', 'center', 700);
  for (let i = 0; i < p.maxHp; i++) {
    ctx.fillStyle = i < p.hp ? '#ff5d6c' : 'rgba(255,255,255,.2)';
    ctx.fillRect(14 + i * 18, 22, 13, 13);
  }
  text('Lv ' + G.level, VW - 14, 30, 16, '#c8d6df', 'right');
  if (G.boss) {
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fillRect(40, 54, VW - 80, 8);
    ctx.fillStyle = '#ff5d6c';
    ctx.fillRect(40, 54, (VW - 80) * Math.max(0, G.boss.hp / G.boss.maxHp), 8);
  }
}

function dim(alpha) {
  ctx.fillStyle = 'rgba(8,16,28,' + alpha + ')';
  ctx.fillRect(0, -uiY, VW, VH);
}

function drawMenu() {
  const [mx, my] = R3D.unproject(VW / 2, 335 + Math.sin(G.sky * 2) * 6);
  R3D.drawMesh(R3D.meshes.player, mx, my, 0, { s: 2.5, yaw: G.sky * 0.7, roll: 0.22, pitch: 0.12 });
  text('云霄突围', VW / 2, 170, 50, '#ffffff', 'center', 700);
  text('自动开火，拖动躲弹幕，升级变强', VW / 2, 226, 17, '#c8d6df');
  if (save.best > 0) text('最高分 ' + save.best, VW / 2, 442, 17, '#ffd166');
  button('开始', 90, 470, 220, 56, start);
  button('机库  金币 ' + save.coins, 90, 540, 220, 48, () => { G.mode = 'hangar'; }, 'plain');
}

function drawHangar() {
  dim(0.5);
  text('机库', VW / 2, 90, 34, '#ffffff', 'center', 700);
  text('金币 ' + save.coins, VW / 2, 134, 18, '#ffd166');
  HANGAR.forEach((item, i) => {
    const y = 176 + i * 122;
    const lv = save[item.id];
    roundRect(30, y, VW - 60, 108, 8);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fill();
    text(item.name + '  ' + lv + '/' + item.max, 48, y + 28, 19, '#ffffff', 'left');
    text(item.desc, 48, y + 58, 15, '#c8d6df', 'left');
    if (lv >= item.max) {
      text('已满级', VW - 48, y + 54, 16, '#7cf29c', 'right');
    } else {
      const cost = item.cost(lv);
      button(cost + ' 金币', VW - 150, y + 32, 106, 44, () => buy(item), save.coins >= cost ? 'main' : 'off');
    }
  });
  button('返回', 110, 580, 180, 50, goMenu, 'plain');
}

function drawPick() {
  dim(0.78);
  text('升级  选一项', VW / 2, 130, 28, '#ffffff', 'center', 700);
  G.choices.forEach((u, i) => {
    const y = 176 + i * 104;
    G.buttons.push({ x: 40, y: y + uiY, w: VW - 80, h: 92, onTap: () => pick(u), key: String(i + 1) });
    roundRect(40, y, VW - 80, 92, 8);
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    text(u.name, 60, y + 32, 21, '#ffd166', 'left');
    text(u.desc, 60, y + 62, 15, '#e3ebf0', 'left');
  });
  if (G.choices.length > 1 && ads.canShow('take_all').ok) button('看广告全部拿走', 90, 506, 220, 48, watchTakeAll, 'ad');
}

function drawDead() {
  dim(0.66);
  text('被击落', VW / 2, 210, 36, '#ffffff', 'center', 700);
  text('当前 ' + G.score + ' 分', VW / 2, 262, 19, '#c8d6df');
  button('看广告复活', 90, 330, 220, 56, watchRevive, 'ad');
  button('放弃', 90, 400, 220, 48, finish, 'plain');
}

function drawResult() {
  dim(0.66);
  text(String(G.score), VW / 2, 170, 56, '#ffffff', 'center', 700);
  text('最高分 ' + save.best, VW / 2, 226, 18, '#c8d6df');
  const gap = save.best - G.score;
  if (G.isRecord) text('新纪录！', VW / 2, 262, 19, '#ffd166');
  else if (gap <= save.best * 0.15) text('就差 ' + (gap + 1) + ' 分破纪录', VW / 2, 262, 18, '#ffd166');
  text('获得金币 ' + G.earned, VW / 2, 306, 20, '#ffd166');
  let y = 346;
  if (!G.doubled && G.earned > 0 && ads.canShow('double_coins').ok) {
    button('看广告金币翻倍', 90, y, 220, 48, watchDouble, 'ad');
    y += 62;
  }
  button('再来一局', 90, y, 220, 56, playAgain);
  button('机库', 90, y + 68, 220, 46, () => { G.mode = 'hangar'; }, 'plain');
}

function drawAd() {
  ctx.fillStyle = 'rgba(0,0,0,.92)';
  ctx.fillRect(0, 0, VW, VH);
  const y = VH / 2;
  text('模拟广告', VW / 2, y - 50, 30, '#ffffff', 'center', 700);
  text('这里是真实广告的位置', VW / 2, y - 6, 16, '#c8d6df');
  text(Math.ceil(G.ad.left) + ' 秒', VW / 2, y + 38, 20, '#ffd166');
  if (G.ad.rewarded) text('点屏幕提前关闭（不发奖）', VW / 2, y + 92, 15, '#8fa0ac');
}

function draw() {
  ctx.fillStyle = '#0a1420';
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, VW, VH);
  ctx.clip();
  if (G.shake > 0 && !calm) ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
  R3D.setView(ctx, VW, VH, G.cam);
  drawGround();
  G.buttons = [];
  const inRun = G.mode === 'play' || G.mode === 'pick' || G.mode === 'dead' || G.mode === 'result';
  if (inRun) drawShadows();
  G.clouds.filter(c => !c.high).forEach(drawCloud);
  if (inRun) drawWorld();
  G.clouds.filter(c => c.high).forEach(drawCloud);
  if (inRun) {
    drawHud();
    drawTexts();
  }
  ctx.save();
  ctx.translate(0, uiY);
  if (G.mode === 'menu') drawMenu();
  if (G.mode === 'hangar') drawHangar();
  if (G.mode === 'pick') drawPick();
  if (G.mode === 'dead') drawDead();
  if (G.mode === 'result') drawResult();
  if (G.paused && G.mode === 'play') {
    dim(0.6);
    text('暂停', VW / 2, 320, 34, '#ffffff', 'center', 700);
    text('点屏幕继续', VW / 2, 370, 17, '#c8d6df');
  }
  ctx.restore();
  if (G.bannerOn && G.mode === 'menu') {
    ctx.fillStyle = '#1fa7a0';
    ctx.fillRect(0, VH - 56, VW, 56);
    text('模拟横幅广告', VW / 2, VH - 28, 15, '#ffffff');
  }
  if (G.ad) {
    G.buttons = [];
    drawAd();
  }
  ctx.restore();
}

/* ---------- 声音 ---------- */

let audio = null;
let muted = false;
let lastSound = 0;

function sound(freq, dur, type, vol) {
  if (muted) return;
  const t0 = Date.now();
  if (t0 - lastSound < 18) return;
  lastSound = t0;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio = audio || new AC();
    if (audio.state === 'suspended') audio.resume();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch (e) { /* 没有声音也能玩 */ }
}

/* ---------- 输入 ---------- */

let dragging = false;
let lastX = 0;
let lastY = 0;

function toGame(e) {
  return [(e.clientX - offX) / scale, (e.clientY - offY) / scale];
}

function press(x, y) {
  if (G.ad) {
    if (G.ad.rewarded) closeAd(false);
    return;
  }
  if (G.paused) {
    G.paused = false;
    return;
  }
  for (const b of G.buttons) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      b.onTap();
      return;
    }
  }
}

window.addEventListener('pointerdown', e => {
  e.preventDefault();
  const [x, y] = toGame(e);
  dragging = true;
  lastX = x;
  lastY = y;
  press(x, y);
});
window.addEventListener('pointermove', e => {
  if (G.mode !== 'play' || G.paused || G.ad) return;
  const [x, y] = toGame(e);
  if (e.pointerType === 'mouse') {
    const [wx, wy] = R3D.unproject(x, y);
    G.p.x = wx;
    G.p.y = wy - 10;
  } else if (dragging) {
    G.p.x += (x - lastX) * 1.2;
    G.p.y += (y - lastY) * 0.85;
  }
  lastX = x;
  lastY = y;
});
window.addEventListener('pointerup', () => { dragging = false; });
window.addEventListener('pointercancel', () => { dragging = false; });

const KEYS = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down',
};
window.addEventListener('keydown', e => {
  if (KEYS[e.code]) {
    G.keys[KEYS[e.code]] = true;
    e.preventDefault();
  } else if (e.code === 'KeyM') {
    muted = !muted;
  } else if (!e.repeat) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      const b = G.buttons.find(x => x.primary);
      if (G.paused) G.paused = false;
      else if (b) b.onTap();
    } else {
      const b = G.buttons.find(x => 'Digit' + x.key === e.code);
      if (b) b.onTap();
    }
  }
});
window.addEventListener('keyup', e => {
  if (KEYS[e.code]) G.keys[KEYS[e.code]] = false;
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && G.mode === 'play') G.paused = true;
});
window.addEventListener('resize', resize);

let last = 0;
function frame(ts) {
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;
  step(dt);
  draw();
  requestAnimationFrame(frame);
}
resize();
goMenu();
requestAnimationFrame(ts => { last = ts; frame(ts); });
