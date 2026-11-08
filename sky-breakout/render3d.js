/*
 * 小型 3D 渲染：透视投影 + 低多边形模型 + 平面光照，全部画在 2D canvas 上。
 * 不依赖外部引擎，移植微信小游戏时包体很小。
 *
 * 世界坐标沿用游戏逻辑的 x、y（y 越小越远），z 是高度。
 * 模型坐标：X 向右，Y 向前，Z 向上。
 */
const R3D = (function () {
  const TAU = Math.PI * 2;
  const PERSPECTIVE = 0.75; /* 越大，远处缩得越小 */
  const NEAR_SCALE = 1.1;
  const TOP = 78; /* 逻辑 y=0 落在屏幕上的位置，给分数栏留空间 */
  const LIGHT = normalize([-0.35, -0.25, 0.9]);
  const TO_CAMERA = normalize([0, -0.7, 0.7]);

  let ctx = null;
  let vw = 400;
  let vh = 720;
  let cam = 0;
  let stretch = 1;

  function normalize(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function setView(context, width, height, camX) {
    ctx = context;
    vw = width;
    vh = height;
    cam = camX;
    stretch = (vh - TOP) * (1 + PERSPECTIVE) / vh;
  }

  /* 返回 [屏幕 x, 屏幕 y, 这个深度下的缩放] */
  function project(x, y, z) {
    const v = vh - y;
    const w = 1 + PERSPECTIVE * v / vh;
    const s = NEAR_SCALE / w;
    return [vw / 2 + (x - vw / 2 - cam) * s, vh - stretch * v / w - z * s, s];
  }

  /* 屏幕坐标反推游戏平面上的位置，鼠标操作用。 */
  function unproject(sx, sy) {
    const u = Math.min((vh - sy) / stretch, vh / PERSPECTIVE * 0.9);
    const v = u / (1 - PERSPECTIVE * u / vh);
    const w = 1 + PERSPECTIVE * v / vh;
    return [vw / 2 + (sx - vw / 2) * w / NEAR_SCALE + cam, vh - v];
  }

  const shades = {};
  function shade(hex, light) {
    const q = Math.round(light * 12);
    const key = hex + q;
    if (shades[key]) return shades[key];
    const n = parseInt(hex.slice(1), 16);
    const f = q / 12;
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(ch => Math.min(255, Math.round(ch * f)));
    shades[key] = 'rgb(' + c.join(',') + ')';
    return shades[key];
  }

  /* 多边形法线，顶点重合的面也能算对。 */
  function faceNormal(pts) {
    let nx = 0;
    let ny = 0;
    let nz = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return normalize([nx, ny, nz]);
  }

  function drawMesh(mesh, x, y, z, options) {
    const o = options || {};
    const s = o.s || 1;
    const cr = Math.cos(o.roll || 0);
    const sr = Math.sin(o.roll || 0);
    const cp = Math.cos(o.pitch || 0);
    const sp = Math.sin(o.pitch || 0);
    const cy = Math.cos(o.yaw || 0);
    const sy = Math.sin(o.yaw || 0);

    const rotated = mesh.v.map(p => {
      const x1 = p[0] * cr + p[2] * sr;
      const z1 = -p[0] * sr + p[2] * cr;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      return [x1 * cy - y2 * sy, x1 * sy + y2 * cy, z2];
    });
    const screen = rotated.map(p => project(x + p[0] * s, y - p[1] * s, z + p[2] * s));

    const faces = mesh.f.map(f => {
      const pts = f.i.map(i => rotated[i]);
      let n = faceNormal(pts);
      if (n[0] * TO_CAMERA[0] + n[1] * TO_CAMERA[1] + n[2] * TO_CAMERA[2] < 0) n = [-n[0], -n[1], -n[2]];
      const lit = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
      let depth = 0;
      for (const p of pts) depth += p[1] * 0.7 - p[2] * 0.7;
      return { f, depth: depth / pts.length, light: Math.min(1.15, 0.5 + 0.65 * Math.max(0, lit)) };
    });
    faces.sort((a, b) => b.depth - a.depth);

    ctx.lineWidth = 0.6;
    ctx.lineJoin = 'round';
    for (const face of faces) {
      const color = o.flash ? '#ffffff' : shade(face.f.c, face.light);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      face.f.i.forEach((i, k) => {
        const p = screen[i];
        if (k === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  /* ---------- 模型 ---------- */

  function tube(m, sections, color, sides) {
    const n = sides || 6;
    const base = m.v.length;
    sections.forEach(sec => {
      for (let k = 0; k < n; k++) {
        const a = (k + 0.5) / n * TAU;
        m.v.push([(sec.x || 0) + Math.cos(a) * sec.rx, sec.y, (sec.z || 0) + Math.sin(a) * sec.rz]);
      }
    });
    for (let i = 0; i < sections.length - 1; i++) {
      for (let k = 0; k < n; k++) {
        const a = base + i * n;
        const b = a + n;
        m.f.push({ i: [a + k, a + (k + 1) % n, b + (k + 1) % n, b + k], c: color });
      }
    }
    const last = base + (sections.length - 1) * n;
    m.f.push({ i: Array.from({ length: n }, (_, k) => last + k), c: color });
  }

  function plate(m, pts, color) {
    const base = m.v.length;
    pts.forEach(p => m.v.push(p));
    m.f.push({ i: pts.map((_, k) => base + k), c: color });
  }

  function wings(m, pts, color) {
    plate(m, pts, color);
    plate(m, pts.map(p => [-p[0], p[1], p[2]]), color);
  }

  function jet() {
    const m = { v: [], f: [] };
    tube(m, [{ y: 30, rx: 0, rz: 0 }, { y: 12, rx: 5, rz: 4.5 }, { y: -6, rx: 7, rz: 6.5 }, { y: -24, rx: 5, rz: 4 }], '#e6edf2');
    wings(m, [[6, 8, 0], [31, -14, -3], [31, -22, -3], [6, -16, 0]], '#4fc0e4');
    wings(m, [[28, -13, -3], [32, -14, -3.2], [32, -22, -3.2], [28, -22, -3]], '#ff5d6c');
    wings(m, [[5, -16, 1], [15, -26, 0], [15, -29, 0], [5, -24, 1]], '#4fc0e4');
    wings(m, [[3, -12, 5], [7, -26, 18], [7, -29, 18], [3, -24, 4]], '#d7e2e9');
    tube(m, [{ y: 16, rx: 0, rz: 0, z: 5 }, { y: 7, rx: 3.6, rz: 3.2, z: 6 }, { y: -4, rx: 2.4, rz: 2, z: 6 }], '#1b5c86');
    return m;
  }

  function scout(color) {
    const m = { v: [], f: [] };
    tube(m, [{ y: 16, rx: 0, rz: 0 }, { y: 2, rx: 5, rz: 4 }, { y: -12, rx: 4, rz: 3 }], color);
    wings(m, [[4, 4, 0], [17, -9, 3], [17, -14, 3], [4, -10, 0]], color);
    tube(m, [{ y: 6, rx: 0, rz: 0, z: 3 }, { y: 0, rx: 2.4, rz: 2, z: 4 }, { y: -5, rx: 1.6, rz: 1.4, z: 3.5 }], '#3a2430');
    return m;
  }

  function weaver(color) {
    const m = { v: [], f: [] };
    tube(m, [{ y: 12, rx: 0, rz: 0 }, { y: 0, rx: 4.5, rz: 4 }, { y: -10, rx: 3, rz: 2.5 }], color);
    wings(m, [[3, -4, 0], [18, 10, 5], [21, 6, 5], [8, -11, 0]], color);
    wings(m, [[3, -6, 2], [8, -14, 9], [10, -15, 9], [4, -10, 2]], '#fff0c8');
    return m;
  }

  function diver(color) {
    const m = { v: [], f: [] };
    tube(m, [{ y: 22, rx: 0, rz: 0 }, { y: 6, rx: 3.5, rz: 3 }, { y: -16, rx: 3, rz: 2.5 }], color);
    wings(m, [[3, 0, 0], [13, -17, -2], [13, -20, -2], [3, -15, 0]], color);
    wings(m, [[2, -8, 2], [2, -19, 11], [3, -21, 11], [3, -15, 2]], '#ffd2e4');
    return m;
  }

  function gunner(color) {
    const m = { v: [], f: [] };
    const ring = (r, z) => { const a = []; for (let k = 0; k < 6; k++) a.push([Math.cos(k / 6 * TAU) * r, Math.sin(k / 6 * TAU) * r, z]); return a; };
    const base = m.v.length;
    [ring(15, -6), ring(23, 0), ring(13, 8)].forEach(r => r.forEach(p => m.v.push(p)));
    for (let i = 0; i < 2; i++) {
      for (let k = 0; k < 6; k++) {
        const a = base + i * 6;
        const b = a + 6;
        m.f.push({ i: [a + k, a + (k + 1) % 6, b + (k + 1) % 6, b + k], c: color });
      }
    }
    m.f.push({ i: [12, 13, 14, 15, 16, 17].map(i => base + i), c: '#e3cfff' });
    tube(m, [{ y: 26, rx: 2.4, rz: 2.4, z: 5 }, { y: 6, rx: 3.4, rz: 3.4, z: 5 }], '#40305e', 4);
    return m;
  }

  function flagship() {
    const m = { v: [], f: [] };
    const hull = '#c9405f';
    tube(m, [{ y: 66, rx: 0, rz: 0 }, { y: 30, rx: 22, rz: 15 }, { y: -18, rx: 28, rz: 20 }, { y: -58, rx: 16, rz: 11 }], hull, 8);
    wings(m, [[22, 26, 0], [108, -16, -6], [108, -38, -6], [24, -30, 0]], '#a12f4c');
    wings(m, [[88, -14, -6], [110, -16, -7], [110, -38, -7], [88, -38, -6]], '#ffb347');
    wings(m, [[20, -22, 10], [44, -52, 36], [50, -56, 36], [22, -44, 8]], '#8c2843');
    tube(m, [{ x: 58, y: 18, rx: 0, rz: 0, z: -5 }, { x: 58, y: 4, rx: 9, rz: 9, z: -5 }, { x: 58, y: -40, rx: 8, rz: 8, z: -5 }], '#6f2a44', 6);
    tube(m, [{ x: -58, y: 18, rx: 0, rz: 0, z: -5 }, { x: -58, y: 4, rx: 9, rz: 9, z: -5 }, { x: -58, y: -40, rx: 8, rz: 8, z: -5 }], '#6f2a44', 6);
    tube(m, [{ y: 34, rx: 0, rz: 0, z: 15 }, { y: 16, rx: 12, rz: 10, z: 19 }, { y: -8, rx: 9, rz: 8, z: 19 }, { y: -22, rx: 0, rz: 0, z: 15 }], '#ffd166', 6);
    return m;
  }

  return {
    setView,
    project,
    unproject,
    drawMesh,
    meshes: {
      player: jet(),
      scout: scout('#ff7a59'),
      weaver: weaver('#ffb347'),
      diver: diver('#f25f9a'),
      gunner: gunner('#b983ff'),
      boss: flagship(),
    },
  };
})();
