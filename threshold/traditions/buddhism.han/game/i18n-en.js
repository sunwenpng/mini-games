/*
 * 山寺小院英文界面词表（AI 起草，正式发布前需英语母语审校，经名译法需顾问确认）。
 * exact：整句对照；words：模板里的片段（动物、名字、食物、经名）；patterns：带数字或名字的句子。
 * 经文原文、竖排经题保持中文，不翻译。
 */
var HAN_EN = (function () {
  'use strict';
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const HOURS = { '子': 'Rat hour', '丑': 'Ox hour', '寅': 'Tiger hour', '卯': 'Rabbit hour', '辰': 'Dragon hour', '巳': 'Snake hour', '午': 'Horse hour', '未': 'Goat hour', '申': 'Monkey hour', '酉': 'Rooster hour', '戌': 'Dog hour', '亥': 'Pig hour' };
  const SEASONS = { '春': 'Spring', '夏': 'Summer', '秋': 'Autumn', '冬': 'Winter' };
  const SKY = { '晴': 'Clear', '雨': 'Rain', '雪': 'Snow', '夜': 'Night' };

  const words = {
    /* 动物 */
    '橘猫': 'orange cat', '狸花猫': 'tabby cat', '小黑猫': 'black kitten', '白猫': 'white cat',
    '小黄狗': 'yellow puppy', '小黑狗': 'black puppy', '小麻雀': 'little sparrow',
    /* 名字 */
    '橘子': 'Tangerine', '年糕': 'Mochi', '糯米': 'Sticky Rice', '芝麻': 'Sesame', '煤球': 'Coal', '雪球': 'Snowball', '团子': 'Dumpling',
    '元宵': 'Lantern', '小满': 'Xiaoman', '招财': 'Lucky', '豆包': 'Bean Bun', '阿福': 'Fu', '花卷': 'Twist', '麦芽': 'Malt', '可乐': 'Cola', '奶盖': 'Foam',
    '旺财': 'Wangcai', '来福': 'Laifu', '豆豆': 'Doudou', '大黄': 'Goldie', '阿黑': 'Blackie', '馒头': 'Bun', '土豆': 'Potato', '石头': 'Pebble', '虎子': 'Tiger', '小米': 'Millet',
    '啾啾': 'Chirp', '米粒': 'Grain', '豆丁': 'Peanut', '小灰': 'Grey', '叽喳': 'Chatter', '谷子': 'Barley',
    /* 食物与物品 */
    '猫粮': 'Cat food', '狗粮': 'Dog food', '牛奶': 'Milk', '清水': 'Water', '碘伏和纱布': 'Iodine and gauze',
    /* 院子里可扫的东西 */
    '落叶': 'fallen leaves', '落花': 'fallen petals', '断枝杂草': 'twigs and weeds', '积雪': 'snow',
    /* 经名 */
    '心经': 'Heart Sutra', '大悲咒': 'Great Compassion Dharani', '往生咒': 'Rebirth Dharani', '金刚经偈': 'Diamond Sutra Verses', '六字真言': 'Six-Syllable Mantra', '念佛': 'Amitabha Recitation',
    '玄奘译本': 'Xuanzang translation', '八十四句': '84 lines', '净土陀罗尼': 'Pure Land dharani', '鸠摩罗什译本': 'Kumarajiva translation', '二十一遍': '21 times', '十八遍': '18 times',
    /* 供品 */
    '供花': 'Flowers', '供果': 'Fruit', '供水': 'Water', '供灯': 'Lamps',
    '一对莲花': 'A pair of lotus flowers', '一对莲花，敬献佛前': 'A pair of lotus flowers for the Buddha', '两盘时令水果': 'Two plates of seasonal fruit', '七杯清净水': 'Seven cups of clear water', '点亮六盏酥油灯': 'Six butter lamps, lit',
    /* 领养人 */
    '山下开面馆的王阿姨': 'Auntie Wang, who runs the noodle shop down the hill',
    '来寺里写生的美院学生小林': 'Lin, an art student who comes to sketch at the temple',
    '退休的李老师，家里有个小院': 'Mr Li, a retired teacher with a small garden',
    '每周来上香的陈叔一家': 'the Chen family, who come to offer incense every week',
    '镇卫生院的护士小周': 'Zhou, a nurse at the town clinic',
    '在城里工作的程序员阿杰': 'Jie, a programmer who works in the city',
    '种茶的赵大爷': 'Grandpa Zhao, a tea farmer',
    '带着孙女来祈福的刘奶奶': 'Grandma Liu, who comes with her granddaughter to pray',
    /* 声线 */
    '清朗随诵': 'Clear', '庄重慢诵': 'Slow and solemn', '寺院回响': 'Temple hall',
    /* 诵经状态 */
    '一敲一字': 'one tap, one character', '自动诵经中': 'reciting automatically', '本句已诵': 'line complete',
  };

  const exact = Object.assign({}, words, {
    /* 标题与按钮 */
    '山寺小院': 'Mountain Temple Yard', '商店': 'Shop', '送养册': 'Adoption book', '祈福': 'Make a wish', '供奉': 'Offer', '天时': 'Sky', '声线': 'Voice',
    '平台': 'Home', '静音': 'Muted', '好': 'OK', '合上': 'Close', '换经': 'Other text', '停止': 'Stop', '自动诵经': 'Auto recite', '木鱼 开': 'Fish on', '木鱼 关': 'Fish off',
    '选一部经': 'Choose a text', '开始诵': 'Start', '接着诵': 'Continue', '进入小院': 'Enter the yard',
    '上香': 'Incense', '三炷香': '3 sticks', '进殿': 'Hall', '礼佛供奉': 'Bow, offer', '诵经': 'Chant', '六部可选': '6 texts', '撞钟': 'Bell', '钟声': 'Toll',
    '晨钟': 'Morning', '暮钟': 'Evening', '出坡': 'Chores', '扫院子': 'Sweep', '粮食药品': 'Food, care',
    '礼佛': 'Bow', '三拜': '3 bows', '礼拜中': 'Bowing', '花果水灯': '4 offerings', '许个心愿': 'A wish', '出殿': 'Leave', '回到小院': 'To yard',
    '点木鱼': 'Tap the wooden fish', '存粮': 'Stores', '摸摸': 'Pet', '起名': 'Name', '送养': 'Rehome', '喂它吃': 'Feed it',
    '饱食': 'Fed', '健康': 'Health', '亲近': 'Trust', '还没有名字': 'No name yet', '身体健康': 'Healthy', '伤口包好了，正在恢复': 'Wound dressed, healing',
    '饿得肚子咕咕叫': 'Very hungry', '猫粮·免费': 'Cat food · free',
    '给它起个名字': 'Give it a name', '换一批': 'Other names', '先不起': 'Not now',
    '粮食和药品': 'Food and medicine', '工具和小院': 'Tools and yard', '添置扫帚和簸箕': 'New broom and dustpan', '请小沙弥': 'Invite a young monk', '扩建猫窝': 'Bigger shelter',
    '已满': 'Full', '已经满员': 'No more room', '已经最大': 'Largest size', '支持我们：看一段广告': 'Support us: watch an ad',
    '猫的主粮': 'Main food for cats', '狗的主粮': 'Main food for dogs', '小鸟爱吃': 'Birds love it', '斋堂剩下的': 'From the temple kitchen', '香客送的': 'Gift from a visitor', '处理伤口': 'For wounds',
    '小沙弥 扫地': 'Monk sweeping',
    '一拜': 'First bow', '二拜': 'Second bow', '功德圆满': 'Complete',
    '山门外有动静 →': 'Something at the gate →',
    '时辰': 'Time', '季节': 'Season', '天气': 'Weather', '实时': 'Live', '日出': 'Sunrise', '白天': 'Day', '日落': 'Sunset', '夜晚': 'Night',
    '春': 'Spring', '夏': 'Summer', '秋': 'Autumn', '冬': 'Winter', '晴': 'Clear', '下雨': 'Rain', '下雪': 'Snow',
    '换个时辰和季节，看看小院不同的样子': 'Change the time and season to see the yard differently',
    '“实时”会跟着你所在地的真实时间和季节走': '"Live" follows your local time and season',
    '祈 福': 'B L E S S I N G', '平安': 'Safety', '学业': 'Study', '事业': 'Work', '姻缘': 'Love', '家人': 'Family',
    '在佛前许一个心愿': 'Make a wish before the Buddha',
    '祈福不计分数，心愿只写在这块牌子上': 'Wishes are not scored. They are only written on this plaque',
    '供品摆上供桌，十分钟后撤下，可以再供': 'Offerings stay on the altar for ten minutes; then you can offer again',
    '大雄宝殿': 'Main hall',
    /* 祈福牌（逐句） */
    '出入平安': 'Safe in every journey', '岁岁无忧': 'free of worry every year', '一路顺风': 'A smooth road', '诸事顺遂': 'and all things going well',
    '家宅安宁': 'A peaceful home', '四季平安': 'safe in every season', '身体康健': 'Good health', '百病不侵': 'free of illness',
    '吃得香': 'Eat well', '睡得稳': 'sleep well', '笑得开': 'laugh freely', '愿家人无病无痛': 'May your family be free of pain', '长寿安康': 'and live long and well',
    '心静如水': 'A mind as calm as water', '学有所成': 'and study that bears fruit', '勤学不辍': 'Keep studying', '金榜题名': 'and pass with honours',
    '考场从容': 'Calm in the exam hall', '下笔有神': 'and inspired in every answer', '所求皆如愿': 'May you find what you seek', '所行化坦途': 'and your road be smooth',
    '贵人相助': 'Help from good people', '步步登高': 'and steady progress', '踏实做事': 'Do steady work', '前程似锦': 'and a bright future',
    '遇良人': 'Meet the right person', '得良缘': 'and find a good match', '有情人终成眷属': 'May lovers be united', '相知相守': 'Know and keep each other', '白首不离': 'until your hair turns white',
    '父母安康': 'Healthy parents', '儿女绕膝': 'and children close by', '家和万事兴': 'A harmonious home brings success', '团团圆圆': 'Together and whole', '平平安安': 'safe and sound',
    /* 开场与说明 */
    '深山里有一座小寺。': 'Deep in the mountains there is a small temple.',
    '敲木鱼、诵经、礼佛、撞钟是修行，只记在修行簿里，不换任何东西。': 'Tapping the wooden fish, chanting, bowing and ringing the bell are practice. They are only noted in your practice log and are never traded for anything.',
    '山门外常有流浪的猫狗和受伤的小鸟。出坡扫院子能攒存粮，换成粮食和药，喂饱它们、治好它们，等它们信任你了，再为它们找一个好人家。': 'Stray cats, dogs and injured birds often come to the gate. Sweeping the yard earns food stores for their food and medicine. Feed them, heal them, and when they trust you, find them a good home.',
    '还没有送养过小动物。把它们喂饱、治好伤、起好名字，等亲近够了，就能为它们找个好人家。': 'No animals rehomed yet. Feed them, heal them and name them; once they trust you enough you can find them a good home.',
    '亲近到 50 就能给它起名字': 'At trust 50 you can name it',
    '它已经信任你了，给它起个名字吧': 'It trusts you now. Give it a name',
    '亲近 80、健康 90、吃饱以后，可以为它找个好人家': 'With trust 80, health 90 and a full belly, it can go to a good home',
    '它已经准备好去新家了': 'It is ready for a new home',
    /* 伤情 */
    '后腿受伤，走路一瘸一拐': 'Hurt back leg, limping', '前爪被划破了': 'Scratched front paw', '眼睛发炎，睁不太开': 'Inflamed eyes, hard to open',
    '背上有一道伤口': 'A cut on its back', '前爪扎了刺': 'A thorn in its front paw', '耳朵被咬伤了': 'Bitten ear', '身上有一道伤口': 'A cut on its body',
    '翅膀受伤，飞不起来': 'Hurt wing, cannot fly', '爪子被线缠伤了': 'Feet tangled and cut by string',
    /* 喂食与照顾 */
    '猫粮营养全面，它吃得很香。': 'Cat food is complete nutrition. It eats happily.',
    '狗粮缺少猫必需的牛磺酸，偶尔吃可以，长期吃会生病。': 'Dog food lacks the taurine cats need. Fine once in a while, harmful long term.',
    '猫是肉食动物，馒头只能顶饿，几乎没有它需要的营养。': 'Cats are carnivores. Steamed buns only fill the stomach and give almost nothing they need.',
    '大多数成年猫乳糖不耐受，喝牛奶容易拉肚子。': 'Most adult cats are lactose intolerant. Milk easily gives them diarrhoea.',
    '它闻了闻，不吃小米。': 'It sniffs and turns down the millet.',
    '猫天生不爱喝水，常备一碗干净的水能少得肾病。': 'Cats do not drink much by nature. A bowl of clean water helps prevent kidney disease.',
    '狗粮吃得干干净净，尾巴摇个不停。': 'It cleans the bowl, tail wagging nonstop.',
    '猫粮的蛋白和脂肪偏高，狗常吃容易胖。': 'Cat food is high in protein and fat. Dogs that eat it often gain weight.',
    '白馒头狗可以吃一点，别泡咸菜汤，盐多了伤肾。': 'Plain buns are fine for dogs in small amounts. No salty broth; too much salt harms the kidneys.',
    '很多狗也乳糖不耐受，喝牛奶会拉肚子。': 'Many dogs are lactose intolerant too. Milk gives them diarrhoea.',
    '它对小米没兴趣。': 'It is not interested in millet.',
    '它喝得很急，看来渴坏了。': 'It drinks fast. It must have been very thirsty.',
    '麻雀最爱小米，啄得飞快。': 'Sparrows love millet and peck it up fast.',
    '馒头要掰成碎屑，发霉的千万不能喂。': 'Break buns into crumbs, and never feed mouldy ones.',
    '鸟类消化不了乳糖，喂牛奶很危险。': 'Birds cannot digest lactose. Milk is dangerous for them.',
    '颗粒太大，小麻雀啄不动。': 'The pellets are too big for a little sparrow.',
    '它在碗边蹦来蹦去，喝了几口水。': 'It hops around the bowl and takes a few sips.',
    '它眯起眼睛，喉咙里呼噜呼噜响': 'It narrows its eyes and purrs',
    '它翻过肚皮，尾巴摇个不停': 'It rolls onto its back, tail wagging',
    '它歪着头看你，没有飞走': 'It tilts its head at you and stays',
    '用碘伏清理了伤口，包好纱布。过一会儿就能好': 'You cleaned the wound with iodine and dressed it. It will heal soon',
    /* 新手 */
    '当前：先喂橘猫一份猫粮（初次免费）': 'Now: feed the orange cat (the first bowl is free)',
    '当前：山门外有动静，回庭院看看': 'Now: something is at the gate. Go back to the yard',
    '当前：找到受伤的橘猫，点它看看': 'Now: find the injured orange cat and tap it',
    '当前：可以去商店添置新扫帚': 'Now: you can buy a new broom in the shop',
    '山门外传来一声猫叫——去看看那只受伤的橘猫': 'A meow from the gate. Go and see the injured orange cat',
    '橘猫吃饱了，蜷在檐下。以后的饭食，靠你扫院子攒下的存粮。': 'The orange cat is full and curls up under the eaves. From now on its meals come from the stores you sweep up.',
    /* 仪式与诵经 */
    '上了三炷香。': 'You lit three sticks of incense.', '三拜已毕': 'Three bows complete', '晨钟响彻山谷': 'The morning bell rings through the valley', '暮钟响彻山谷': 'The evening bell rings through the valley',
    '敲木鱼诵经，一敲一字；也可以点“自动诵经”跟着念': 'Tap the wooden fish to recite, one character per tap, or choose Auto recite and follow along',
    '诵经时不出木鱼声，只念经': 'Chanting without the wooden fish', '诵经时木鱼轻轻打拍子': 'The wooden fish keeps a soft beat while chanting',
    '这台设备没有中文朗读语音，会用吟唱声代替': 'This device has no Chinese voice, so a hummed chant is used instead',
    '这台设备的朗读没有声音，改用吟唱声': 'This device’s speech is silent, so a hummed chant is used instead',
    '无人声，用吟唱代替': 'No voice, hummed chant instead', '已静音': 'Muted',
    '正在播放参考录音：普通话《心经》，CC0，非本产品录制': 'Playing the reference recording: Heart Sutra in Mandarin, CC0, not recorded by us',
    /* 声线弹窗 */
    '诵读声音': 'Recitation voice', '使用中': 'In use', '选择': 'Choose', '试听参考': 'Listen', '停止试听': 'Stop', '立即静音': 'Mute now', '打开声音': 'Sound on', '录制': 'Record',
    '先选择产品声线；正式录音将由真人录制并经传统顾问校音。': 'Pick a voice for now. The final recordings will be made by a real reciter and checked by a tradition advisor.',
    '只用于确定节奏与气质，不冒充我们的自有录音。': 'Used only to set pace and tone. It is not presented as our own recording.',
    '普通话居士诵读 · 2:09 · CC0 公共领域': 'Mandarin, lay reciter · 2:09 · CC0 public domain',
    '真人《心经》参考试听': 'Heart Sutra reference recording',
    '真人签约录制 · 原始音轨留档 · 经文逐字校对 · 对应传统审核': 'Contracted reciter · raw tracks archived · text checked word by word · tradition review',
    '系统语音只作为内测过渡，不作为最终品牌声音。': 'Device voices are a stopgap for preview, not the final voice.',
    '自有正式版标准': 'Standard for our own recordings',
    '字句清楚，适合第一次跟诵': 'Clear words, good for first-timers', '速度较慢，音高沉稳': 'Slower and lower', '舒缓低声，保留磬与殿堂共鸣': 'Soft and low, with bowl bell and hall echo',
    '请先打开声音再试听': 'Turn the sound on first', '参考录音暂时无法播放': 'The reference recording cannot play right now', '点一下页面后再试听录音': 'Tap the page, then try again',
    /* 广告与存档 */
    '模拟广告': 'Simulated ad', '这里是真实广告的位置': 'A real ad would play here', '点屏幕提前关闭（不发奖）': 'Tap to close early (no reward)',
    '已读取山寺小院的进度：功德折成了存粮': 'Loaded your Mountain Temple Yard progress. Old merit became food stores',
    '存档未能保存，请暂时不要关闭页面': 'Could not save. Please keep this page open for now',
    '主存档损坏，已从备份恢复': 'The save was damaged and has been restored from backup',
    '存档损坏，已新建存档': 'The save was damaged; a new one has been started',
    '存档格式异常，已新建存档': 'The save format was invalid; a new one has been started',
    '院': '院', '经': '经',
    '下雪了，小动物们躲到屋檐下': 'It is snowing. The animals shelter under the eaves',
    '下雨了，小动物们躲到屋檐下': 'It is raining. The animals shelter under the eaves',
    '收好': 'Keep it',
  });

  const who = (s, w) => (s.indexOf('这只') === 0 ? 'the ' + w(s.slice(2)) : w(s));
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const N = '([\\d.]+[kM]?)';
  const OBS = {
    '弥勒菩萨圣诞': 'the birthday of Maitreya Bodhisattva', '释迦牟尼佛出家日': "Śākyamuni Buddha's renunciation day",
    '释迦牟尼佛涅槃日': "Śākyamuni Buddha's parinirvāṇa day", '观世音菩萨圣诞': 'the birthday of Guanyin Bodhisattva',
    '佛诞日': "the Buddha's birthday", '观世音菩萨成道日': "Guanyin's day of attaining the Way", '盂兰盆节': 'Ullambana',
    '地藏菩萨圣诞': 'the birthday of Kṣitigarbha Bodhisattva', '观世音菩萨出家日': "Guanyin's renunciation day",
    '药师佛圣诞': 'the birthday of the Medicine Buddha', '阿弥陀佛圣诞': 'the birthday of Amitābha Buddha',
    '释迦牟尼佛成道日': "the Buddha's awakening day (Laba)", '初一': 'the new-moon day (1st of the lunar month)', '十五': 'the full-moon day (15th of the lunar month)',
  };
  const patterns = [
    [/^今天是(.+)$/, m => 'Today is ' + m[1].split('、').map(x => OBS[x] || x).join(' and ')],
    [/^(\d+) 秒$/, m => m[1] + 's'],
    [new RegExp('^' + N + ' 存粮$'), m => m[1] + ' stores'],
    [new RegExp('^存粮 \\+' + N + '$'), m => 'Stores +' + m[1]],
    [new RegExp('^存粮 ' + N + '$'), m => 'Stores ' + m[1]],
    [new RegExp('^小沙弥 \\+' + N + '\\/秒$'), m => 'Monks +' + m[1] + '/s'],
    [/^小沙弥 ×(\d+) 扫地$/, m => m[1] + ' monks sweeping'],
    [/^(\d+)年(\d+)月(\d+)日 · 山寺小院$/, m => MONTHS[m[2] - 1] + ' ' + m[3] + ', ' + m[1] + ' · Mountain Temple Yard'],
    [/^(.+) · (\d+)月(\d+)日$/, (m, w) => cap(w(m[1])) + ' · ' + MONTHS[m[2] - 1] + ' ' + m[3]],
    [/^(大雄宝殿 · )?(春|夏|秋|冬) · (.)时 · (.)$/, m => (m[1] ? 'Main hall · ' : '') + SEASONS[m[2]] + ' · ' + HOURS[m[3]] + ' · ' + (SKY[m[4]] || m[4])],
    [/^燃香 (\d+:\d\d)$/, m => 'Burning ' + m[1]],
    [/^供着 (\d+:\d\d)$/, m => 'On altar ' + m[1]],
    [/^已供 (\d)\/4$/, m => m[1] + '/4 offered'],
    [/^香还燃着，还剩 (\d+:\d\d)$/, m => 'The incense is still burning (' + m[1] + ' left)'],
    [/^(.+)还供着，(\d+:\d\d) 后可以换新的$/, (m, w) => w(m[1]) + ' are still on the altar. You can replace them in ' + m[2]],
    [/^(.+)，已摆上供桌$/, (m, w) => w(m[1]) + ', now on the altar'],
    [/^刚拜过，(\d+) 秒后再来$/, m => 'You just bowed. Come back in ' + m[1] + 's'],
    [/^上药 \((\d+)\)$/, m => 'Treat (' + m[1] + ')'],
    [/^(猫粮|狗粮|小米|馒头|牛奶) (\d+)$/, (m, w) => (m[1] === '小米' ? 'Millet' : m[1] === '馒头' ? 'Buns' : w(m[1])) + ' ' + m[2]],
    [/^×(\d+) {2}(.+) {2}现有 (\d+)$/, (m, w) => '×' + m[1] + '  ' + w(m[2]) + '  have ' + m[3]],
    [/^买了(.+) (\d+) 份$/, (m, w) => 'Bought ' + m[2] + ' × ' + (m[1] === '小米' ? 'millet' : m[1] === '馒头' ? 'buns' : w(m[1]).toLowerCase())],
    [/^没有(.+)了。去商店购买吧$/, (m, w) => 'Out of ' + (m[1] === '小米' ? 'millet' : m[1] === '馒头' ? 'buns' : w(m[1]).toLowerCase()) + '. Buy more in the shop'],
    [new RegExp('^存粮不够，还差 ' + N + ' 份。去扫扫院子吧$'), m => 'Not enough stores (' + m[1] + ' short). Go sweep the yard'],
    [/^每扫一次存粮 (\d+) → (\d+)$/, m => 'Stores per sweep ' + m[1] + ' → ' + m[2]],
    [/^帮你扫院子，现有 (\d+) 位$/, m => 'Helps sweep the yard (' + m[1] + ' now)'],
    [/^能收留 (\d+) → (\d+) 只$/, m => 'Room for ' + m[1] + ' → ' + m[2] + ' animals'],
    [/^来了一位小沙弥，会帮你扫院子$/, () => 'A young monk has come to help sweep the yard'],
    [/^又来了一位小沙弥，现在有 (\d+) 位$/, m => 'Another young monk has come. There are ' + m[1] + ' now'],
    [/^猫窝扩建好了，最多能收留 (\d+) 只$/, m => 'The shelter is bigger now and holds up to ' + m[1] + ' animals'],
    [/^添置了新扫帚和簸箕，每扫一堆多得存粮$/, () => 'New broom and dustpan: each sweep gives more stores'],
    [new RegExp('^谢谢支持，存粮 \\+' + N + '$'), m => 'Thank you for your support. Stores +' + m[1]],
    [new RegExp('^存粮 \\+' + N + ' · 模拟广告，不产生真实收入$'), m => 'Stores +' + m[1] + ' · simulated ad, no real income'],
    [new RegExp('^领养人留下一袋粮食：存粮 \\+' + N + '$'), m => 'The new family left a bag of food: stores +' + m[1]],
    [/^你离开了 (\d+) (小时|分钟)(.*)$/, m => {
      let out = 'You were away for ' + m[1] + (m[2] === '小时' ? (m[1] === '1' ? ' hour' : ' hours') : (m[1] === '1' ? ' minute' : ' minutes'));
      const got = /小沙弥扫院子攒了 ([\d.]+[kM]?) 份存粮/.exec(m[3]);
      if (got) out += '; the monks swept up ' + got[1] + ' stores';
      if (m[3].indexOf('小动物们饿了') >= 0) out += '. The animals are hungry';
      return out;
    }],
    [/^(.+) · 第 (\d+)\/(\d+) 句 · (\d+)%(?: · 第 (\d+)\/(\d+) 页)? · (.+)$/, (m, w) => w(m[1]) + ' · line ' + m[2] + '/' + m[3] + ' · ' + m[4] + '%' + (m[5] ? ' · page ' + m[5] + '/' + m[6] : '') + ' · ' + w(m[7])],
    [/^诵毕 · (.+)已诵 (\d+) 遍$/, (m, w) => 'Done · ' + w(m[1]) + ' recited ' + m[2] + '×'],
    [/^诵毕一遍(.+)，已记入修行簿$/, (m, w) => 'One recitation of the ' + w(m[1]) + ' complete. Noted in your practice log'],
    [/^当前：诵《(.+)》第 (\d+)\/(\d+) 句$/, (m, w) => 'Now: ' + w(m[1]) + ', line ' + m[2] + '/' + m[3]],
    [/^当前：敲五下木鱼，听听山门外的动静（(\d)\/5）$/, m => 'Now: tap the wooden fish five times and listen at the gate (' + m[1] + '/5)'],
    [/^当前：给(.+)上药$/, (m, w) => 'Now: treat ' + who(m[1], w)],
    [/^当前：给(.+)添饭$/, (m, w) => 'Now: feed ' + who(m[1], w)],
    [/^当前：去商店买(.+)$/, (m, w) => 'Now: buy ' + (m[1] === '小米' ? 'millet' : m[1] === '馒头' ? 'buns' : w(m[1]).toLowerCase()) + ' in the shop'],
    [new RegExp('^当前：扫院子攒存粮，买(.+)还差 ' + N + ' 份$'), (m, w) => 'Now: sweep the yard. ' + m[2] + ' more stores to buy ' + (m[1] === '小米' ? 'millet' : m[1] === '馒头' ? 'buns' : w(m[1]).toLowerCase())],
    [new RegExp('^当前：扫院子攒存粮，添置新扫帚还差 ' + N + ' 份$'), m => 'Now: sweep the yard. ' + m[1] + ' more stores for a new broom'],
    [/^山门外来了一只(受伤的|饿肚子的)(.+)，点它看看$/, (m, w) => 'A ' + (m[1] === '受伤的' ? 'hurt ' : 'hungry ') + w(m[2]) + ' has come to the gate. Tap it'],
    [/^(.+)还饱着呢$/, (m, w) => cap(who(m[1], w)) + ' is still full'],
    [/^(.+)已经被摸得很舒服了$/, (m, w) => cap(who(m[1], w)) + ' has had plenty of petting'],
    [/^(.+)还怕人，躲开了。先喂点吃的吧$/, (m, w) => cap(who(m[1], w)) + ' is still shy and ran off. Try feeding it first'],
    [/^(.+)的伤好了$/, (m, w) => cap(who(m[1], w)) + ' has healed'],
    [/^这只(.+)以后就叫：$/, (m, w) => 'From now on, the ' + w(m[1]) + ' will be called:'],
    [/^它以后就叫(.+)了$/, (m, w) => 'Its name is now ' + w(m[1])],
    [/^(.+)有家了$/, (m, w) => w(m[1]) + ' has a home'],
    [/^(.+)被(.+)领养了。临走前它回头看了一眼小院。$/, (m, w) => w(m[1]) + ' was adopted by ' + w(m[2]) + '. Before leaving, it looked back at the yard once.'],
    [/^去了(.+)家$/, (m, w) => 'Went home with ' + w(m[1])],
    [new RegExp('^修行簿：木鱼 ' + N + ' 下 · 诵经 (\\d+) 部 · 拜佛 (\\d+) 次$'), m => 'Practice log: wooden fish ' + m[1] + ' · texts ' + m[2] + ' · bows ' + m[3]],
    [new RegExp('^收留 (\\d+) 只 · 送养 (\\d+) 只 · 扫地 ' + N + ' 次$'), m => 'Taken in ' + m[1] + ' · rehomed ' + m[2] + ' · sweeps ' + m[3]],
    [/^院子里有 (\d+) 堆(.+)，点一下就扫，扫完一堆得存粮$/, (m, w) => 'There ' + (m[1] === '1' ? 'is 1 pile' : 'are ' + m[1] + ' piles') + ' of ' + w(m[2]) + ' in the yard. Tap to sweep; each pile you clear gives stores'],
    [/^院子扫干净了，过一会儿又会有(.+)$/, (m, w) => 'The yard is clean. More ' + w(m[1]) + ' will come soon'],
    [/^已切换为“(.+)”$/, (m, w) => 'Switched to "' + w(m[1]) + '"'],
    [/^(.+) · (\d+) 字( · 已诵 (\d+) 遍)?$/, (m, w) => w(m[1]) + ' · ' + m[2] + ' characters' + (m[4] ? ' · recited ' + m[4] + '×' : '')],
    [/^人声：(.+)$/, m => 'Voice: ' + m[1]],
    [/^(清朗随诵|庄重慢诵|寺院回响) · (.+)$/, (m, w) => w(m[1]) + ' · ' + (m[2] === '系统语音' ? 'device voice' : m[2])],
    [/^(.+)：$/, (m, w) => w(m[1]) + ':'],
  ];

  return { exact, words, patterns };
})();
