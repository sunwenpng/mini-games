/*
 * 殿内可瞻仰的主尊或圣所（v2）。照片均为维基共享资源上允许商用的实拍（许可见 credit.lic），介绍由 AI 根据公开常识起草，未经审核。
 * 由 tools 生成：改文字请同时改生成脚本，或直接在这里改。
 */
HallView.define({
  id: "islam.mosque",
  doorLabel: {"zh-CN": "进礼拜殿参观", "en": "Visit the prayer hall"},
  doorIcon: "🕌",
  words: "place",
  halls: [
    {"id": "mihrab", "name": {"zh-CN": "米哈拉布（壁龛）", "en": "The mihrab"}, "sub": {"zh-CN": "指向麦加的方向", "en": "Pointing towards Mecca"}, "img": "halls/isl-mihrab.jpg", "thumb": "halls/t/isl-mihrab.jpg", "hd": "halls/hd/isl-mihrab.jpg", "focus": [0.5, 0.42], "about": {"zh-CN": "清真寺里没有任何神像或人像。礼拜殿正面墙上的拱形壁龛叫米哈拉布，指示麦加天房的方向（朝向），伊玛目站在它前面带领礼拜。上方的金色书法写着《古兰经》经文。\n进殿要脱鞋，女性戴头巾；礼拜时间不要从礼拜的人面前走过。", "en": "There are no images in a mosque. The niche in the front wall, the mihrab, shows the direction of the Kaaba in Mecca; the imam leads prayer before it. The gold calligraphy above is a Qur’anic verse.\nRemove your shoes, women cover their hair, and never walk in front of someone praying."}, "credit": {"who": "Dosseman", "lic": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Istanbul_Yeni_Valide_Mosque_mihrab_in_2015_5684.jpg", "place": {"zh-CN": "伊斯坦布尔新太后清真寺", "en": "Yeni Valide Mosque, Istanbul"}, "file": "File:Istanbul Yeni Valide Mosque mihrab in 2015 5684.jpg"}},
    {"id": "minbar", "name": {"zh-CN": "敏拜尔（讲台）", "en": "The minbar"}, "sub": {"zh-CN": "周五聚礼时伊玛目在此讲道", "en": "Where the imam preaches at Friday prayer"}, "img": "halls/isl-minbar.jpg", "thumb": "halls/t/isl-minbar.jpg", "hd": "halls/hd/isl-minbar.jpg", "focus": [0.5, 0.42], "about": {"zh-CN": "米哈拉布右边的高台阶讲台叫敏拜尔，周五聚礼时伊玛目站在台阶上讲“呼图白”（讲道）。传统上讲道者不会站到最高一级，那是留给先知的。", "en": "To the right of the mihrab stands the stepped minbar, from which the imam gives the Friday sermon (khutba). Traditionally the preacher does not stand on the top step, left for the Prophet."}, "credit": {"who": "Bgag", "lic": "CC0", "url": "https://commons.wikimedia.org/wiki/File:Minbar_of_Hazrati_Imam_Mosque.jpg", "place": {"zh-CN": "乌兹别克斯坦塔什干哈兹拉提伊玛目清真寺", "en": "Hazrati Imam Mosque, Tashkent"}, "file": "File:Minbar of Hazrati Imam Mosque.jpg"}},
    {"id": "dome", "name": {"zh-CN": "穹顶", "en": "The dome"}, "sub": {"zh-CN": "奥斯曼建筑的天空", "en": "An Ottoman sky"}, "img": "halls/isl-dome.jpg", "thumb": "halls/t/isl-dome.jpg", "hd": "halls/hd/isl-dome.jpg", "focus": [0.5, 0.42], "span": [0.25, 0.85], "about": {"zh-CN": "奥斯曼清真寺用一层层半圆穹顶托起中央大穹顶，窗户一圈环绕，光从上面洒下；装饰只用几何纹、植物纹和书法。这是于斯屈达尔新太后清真寺的穹顶。", "en": "Ottoman mosques raise a great central dome on cascading half-domes ringed with windows; decoration is only geometry, plant motifs and calligraphy. This is the dome of the Yeni Valide Mosque in Üsküdar."}, "credit": {"who": "Donnyhoca", "lic": "CC BY 3.0", "url": "https://commons.wikimedia.org/wiki/File:Yeni_Valide_Mosque_Uskudar_interior_dome.jpg", "place": {"zh-CN": "伊斯坦布尔于斯屈达尔新太后清真寺", "en": "Yeni Valide Mosque, Üsküdar, Istanbul"}, "file": "File:Yeni Valide Mosque Uskudar interior dome.jpg"}, "fit": "cover"},
  ],
});
