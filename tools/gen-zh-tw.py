# 生成繁体中文（台湾用语）词表：平台文案 locales/zh-TW.js 与山寺小院 game/i18n-zh-TW.js。
# 需要 OpenCC：pip install opencc-python-reimplemented；用法：python3 tools/gen-zh-tw.py
import json, os, re, subprocess, sys
from opencc import OpenCC

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'threshold')
GAME = ROOT + '/traditions/buddhism.han/game/game.js'
PKG = os.path.dirname(__import__('opencc').__file__) + '/dictionary/'
_TWP = OpenCC('s2twp')
FIX = [('稽核', '審核'), ('影象', '圖像'), ('支援我們', '支持我們'), ('程式設計師', '程式設計師')]
class _Fixed:
    def convert(self, s):
        v = _TWP.convert(s)
        for a, b in FIX:
            v = v.replace(a, b)
        return v
TWP = _Fixed()
S2T = OpenCC('s2t')
CJK = re.compile(r'[㐀-鿿]')

def load_dict(name):
    out = {}
    for line in open(PKG + name, encoding='utf-8'):
        if '\t' not in line:
            continue
        k, v = line.rstrip('\n').split('\t', 1)
        out[k] = v.split(' ')[0]
    return out

# ---------- 平台文案 ----------
def platform():
    js = subprocess.run(['node', '-e', '''
const vm=require("vm"),fs=require("fs");const c={};c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1],"utf8"),c);
process.stdout.write(JSON.stringify(c.Threshold.MESSAGES["zh-CN"]));''', ROOT + '/locales/zh-CN.js'],
        capture_output=True, text=True, check=True).stdout
    zh = json.loads(js)
    tw = {}
    for k, v in zh.items():
        if isinstance(v, dict):
            tw[k] = {kk: TWP.convert(vv) for kk, vv in v.items()}
        else:
            tw[k] = TWP.convert(v)
    # 台湾用语微调：s2twp 偶尔把产品术语换掉，这里改回。
    fix = {
        'brand.sub': 'Threshold · 內測',
    }
    tw.update(fix)
    lines = ['/* 平台介面文案：繁體中文（台灣）。由簡體中文經 OpenCC s2twp 轉換後人工抽查，仍需母語審校。 */',
             '(function (root) {', "  'use strict';", '  const T = (root.Threshold = root.Threshold || {});',
             '  T.MESSAGES = T.MESSAGES || {};', "  T.MESSAGES['zh-TW'] = {"]
    for k, v in tw.items():
        lines.append('    ' + json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False) + ',')
    lines += ['  };', "})(typeof window !== 'undefined' ? window : globalThis);", '']
    open(ROOT + '/locales/zh-TW.js', 'w', encoding='utf-8').write('\n'.join(lines))
    print('platform keys', len(tw))

# ---------- 游戏 ----------
def game():
    src = open(GAME, encoding='utf-8').read()
    start, end = src.index('const SUTRA_TEXTS'), src.index('const SUTRAS =')
    body = src[:start] + src[end:]
    sutra_blk = src[start:end]
    chars = sorted(set(CJK.findall(body)))
    cmap = {}
    for c in chars:
        v = TWP.convert(c)
        if v != c and len(v) == 1:
            cmap[c] = v

    def charwise(s):
        return ''.join(cmap.get(c, c) for c in s)

    phrases = {}
    cand = {}
    cand.update(load_dict('STPhrases.txt'))
    cand.update(load_dict('TWPhrases.txt'))
    for k in cand:
        if len(k) < 2 or k not in body:
            continue
        v = TWP.convert(k)
        if v != charwise(k):
            phrases[k] = v

    phrases['支持我们'] = '支持我們'
    # 幂等：已经是繁体的词组原样保留（文字会被转换两次，比如先断行再绘制）。
    for v in list(phrases.values()):
        if len(v) >= 2 and v not in phrases:
            phrases[v] = v
    maxlen = max([len(k) for k in phrases] + [1])

    def runtime(s):
        out, i = [], 0
        while i < len(s):
            hit = None
            for n in range(min(maxlen, len(s) - i), 1, -1):
                if s[i:i + n] in phrases:
                    hit = s[i:i + n]
                    break
            if hit:
                out.append(phrases[hit])
                i += len(hit)
            else:
                out.append(cmap.get(s[i], s[i]))
                i += 1
        return ''.join(out)

    runs = set(re.findall(r'[㐀-鿿，。、：；！？“”《》·（）0-9a-zA-Z +]+', body))
    bad = [(r, runtime(r), TWP.convert(r)) for r in runs if CJK.search(r) and runtime(r) != TWP.convert(r)]
    print('game chars', len(chars), 'map', len(cmap), 'phrases', len(phrases), 'mismatch', len(bad))
    for b in bad[:30]:
        print('  ', b)

    # 经文：逐字转换为传统写法（不换台湾用语），并确认字数不变、再过一遍字表不会变。
    sutras = {}
    for m in re.finditer(r"id: '(\w+)', title: '([^']*)', short: '([^']*)', note: '([^']*)'", sutra_blk):
        sid = m.group(1)
        tm = re.search(r"id: '" + sid + r"'.*?text: '([^']*)'(?:\.repeat\((\d+)\))?", sutra_blk, re.S)
        text = tm.group(1)
        conv = S2T.convert(text)
        assert len(conv) == len(text), sid
        if tm.group(2):
            conv = conv * int(tm.group(2))
        drift = [c for c in conv if cmap.get(c, c) != c]
        sutras[sid] = {'title': S2T.convert(m.group(2)), 'short': TWP.convert(m.group(3)), 'note': TWP.convert(m.group(4)), 'text': conv}
        print('sutra', sid, len(text), 'drift', ''.join(sorted(set(drift))))

    data = {'chars': cmap, 'phrases': phrases, 'maxPhrase': maxlen, 'sutras': sutras}
    out = ('/* 山寺小院：繁體中文（台灣）字表與詞表。\n'
           ' * 由 OpenCC s2twp 從 game.js 的文案生成（gen_tw.py），在文字繪製出口逐詞轉換；經文用 s2t 逐字轉為傳統寫法。\n'
           ' * 仍需繁體中文母語審校。 */\n'
           'var HAN_TW = ' + json.dumps(data, ensure_ascii=False, indent=0) + ';\n')
    open(ROOT + '/traditions/buddhism.han/game/i18n-zh-TW.js', 'w', encoding='utf-8').write(out)
    print('bytes', len(out.encode('utf-8')))

platform()
game()
