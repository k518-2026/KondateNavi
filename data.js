// 食材・手段・完成形のラベルと検索キーワード
const INGREDIENTS = {
  zanmono: { label: "冷蔵庫の残り物", search: "残り物" },
  kanzume: { label: "缶詰", search: "缶詰" },
  kanbutsu: { label: "乾物", search: "乾物" },
  bousai: { label: "防災用保存食", search: "非常食" },
};

const METHODS = {
  renji: { label: "電子レンジ", search: "レンジ" },
  nabe: { label: "鍋", search: "鍋" },
  furaipan: { label: "フライパン", search: "フライパン" },
};

const STYLES = {
  wafuu: { label: "和風", search: "和風" },
  youfuu: { label: "洋風", search: "洋風" },
  chuuka: { label: "中華", search: "中華" },
  ethnic: { label: "エスニック", search: "エスニック" },
};

// 防災用保存食はニッチな組み合わせだと検索結果が出にくいため、
// 検索キーワードから完成形（style）を外し、食材＋手段の2語にする。
const SEARCH_DROPS_STYLE = new Set(["bousai"]);

const DISHES = [
  { ingredient: "zanmono", method: "renji", style: "wafuu", name: "冷蔵庫の残り物で作る和風レンジ蒸し", desc: "半端に残った野菜や豆腐をレンジで蒸すだけ。だしポン酢でさっぱりと。" },
  { ingredient: "zanmono", method: "renji", style: "youfuu", name: "冷蔵庫の残り物の洋風チーズレンジ蒸し", desc: "残り野菜にチーズをのせてレンジへ。洗い物少なく後片付けも楽。" },
  { ingredient: "zanmono", method: "renji", style: "chuuka", name: "冷蔵庫の残り物の中華風レンジ蒸し", desc: "ごま油と鶏がらスープの素で味付けし、レンジで蒸すだけの一品。" },
  { ingredient: "zanmono", method: "renji", style: "ethnic", name: "冷蔵庫の残り物のエスニック風レンジ蒸し", desc: "ナンプラーとレモンで残り野菜が香り高い一品に変身。" },
  { ingredient: "zanmono", method: "nabe", style: "wafuu", name: "冷蔵庫の残り物の和風寄せ鍋", desc: "余り野菜や豆腐、肉の切れ端をだし汁でコトコト。〆の雑炊まで楽しめる。" },
  { ingredient: "zanmono", method: "nabe", style: "youfuu", name: "冷蔵庫の残り物のポトフ風スープ", desc: "コンソメでじっくり煮込み、残り野菜の甘みを引き出すシンプル洋風スープ。" },
  { ingredient: "zanmono", method: "nabe", style: "chuuka", name: "冷蔵庫の残り物の中華風スープ煮", desc: "鶏がらスープと生姜で温まる中華風の一杯に仕立てる。" },
  { ingredient: "zanmono", method: "nabe", style: "ethnic", name: "冷蔵庫の残り物のエスニックスープ", desc: "ナンプラーとパクチーで残り物を東南アジア風スープに。" },
  { ingredient: "zanmono", method: "furaipan", style: "wafuu", name: "冷蔵庫の残り物の和風炒め", desc: "醤油とみりんで炒めるだけの定番。ご飯のおかずにぴったり。" },
  { ingredient: "zanmono", method: "furaipan", style: "youfuu", name: "冷蔵庫の残り物のガーリックソテー", desc: "にんにくとオリーブオイルで炒めて洋風の副菜に。" },
  { ingredient: "zanmono", method: "furaipan", style: "chuuka", name: "冷蔵庫の残り物のうま塩中華炒め", desc: "鶏がらスープの素とごま油で炒める、ご飯が進む中華炒め。" },
  { ingredient: "zanmono", method: "furaipan", style: "ethnic", name: "冷蔵庫の残り物のナンプラー炒め", desc: "ナンプラーと唐辛子でエスニックな炒め物に仕上げる。" },

  { ingredient: "kanzume", method: "renji", style: "wafuu", name: "缶詰で作る和風あんかけレンジ蒸し", desc: "さば缶やツナ缶を使い、レンジで作る和風あんかけの一品。" },
  { ingredient: "kanzume", method: "renji", style: "youfuu", name: "缶詰の洋風チーズレンジ蒸し", desc: "ツナ缶やコーン缶にチーズをのせてレンジで加熱するだけ。" },
  { ingredient: "kanzume", method: "renji", style: "chuuka", name: "缶詰の中華風レンジ蒸し", desc: "さば缶とねぎ、ごま油でレンジ調理する簡単中華の一品。" },
  { ingredient: "kanzume", method: "renji", style: "ethnic", name: "缶詰のエスニックレンジ蒸し", desc: "ツナ缶とナンプラーでレンジ加熱するだけのエスニック風。" },
  { ingredient: "kanzume", method: "nabe", style: "wafuu", name: "缶詰の和風煮込み鍋", desc: "さば缶やほたて缶をだしで煮込む、缶汁も活かした和風鍋。" },
  { ingredient: "kanzume", method: "nabe", style: "youfuu", name: "缶詰のトマト煮込みスープ", desc: "トマト缶と好きな缶詰を煮込むだけの洋風スープ。" },
  { ingredient: "kanzume", method: "nabe", style: "chuuka", name: "缶詰の中華風スープ煮", desc: "ほたて缶やコーン缶で作る、とろみのある中華スープ。" },
  { ingredient: "kanzume", method: "nabe", style: "ethnic", name: "缶詰のトムヤム風スープ", desc: "シーフード缶とレモンでトムヤム風の酸辣スープに。" },
  { ingredient: "kanzume", method: "furaipan", style: "wafuu", name: "缶詰の和風炒め煮", desc: "さば缶を野菜と炒め煮にする、ご飯がすすむ和風おかず。" },
  { ingredient: "kanzume", method: "furaipan", style: "youfuu", name: "缶詰のガーリックトマトソテー", desc: "ツナ缶とトマト缶をにんにくで炒め、パスタソースにも使える。" },
  { ingredient: "kanzume", method: "furaipan", style: "chuuka", name: "缶詰の中華風あんかけ炒め", desc: "缶詰と野菜を炒め、とろみをつけた中華あんかけに。" },
  { ingredient: "kanzume", method: "furaipan", style: "ethnic", name: "缶詰のエスニック炒め", desc: "ツナ缶やさば缶をナンプラーと唐辛子で炒めるエスニック風。" },

  { ingredient: "kanbutsu", method: "renji", style: "wafuu", name: "乾物の和風レンジ煮", desc: "切り干し大根やひじきを水で戻し、レンジで和風味に。" },
  { ingredient: "kanbutsu", method: "renji", style: "youfuu", name: "乾物の洋風チーズレンジ蒸し", desc: "戻した乾物にチーズをのせてレンジで加熱する洋風アレンジ。" },
  { ingredient: "kanbutsu", method: "renji", style: "chuuka", name: "乾物の中華風レンジ蒸し", desc: "春雨やきくらげをごま油と中華だしでレンジ調理。" },
  { ingredient: "kanbutsu", method: "renji", style: "ethnic", name: "乾物のエスニックレンジ蒸し", desc: "春雨をナンプラーとレモンでレンジ加熱するエスニック風。" },
  { ingredient: "kanbutsu", method: "nabe", style: "wafuu", name: "乾物の和風煮物", desc: "高野豆腐やひじきをだし汁でじっくり煮る、ほっとする和風煮物。" },
  { ingredient: "kanbutsu", method: "nabe", style: "youfuu", name: "乾物の洋風スープ煮", desc: "乾燥野菜や豆をコンソメで煮込む、体が温まる洋風スープ。" },
  { ingredient: "kanbutsu", method: "nabe", style: "chuuka", name: "乾物の中華風スープ煮", desc: "春雨やきくらげを鶏がらスープでコトコト煮た中華風。" },
  { ingredient: "kanbutsu", method: "nabe", style: "ethnic", name: "乾物のエスニックスープ", desc: "春雨とナンプラーで作る、酸味の効いたエスニックスープ。" },
  { ingredient: "kanbutsu", method: "furaipan", style: "wafuu", name: "乾物の和風炒め煮", desc: "切り干し大根やひじきを炒めてから煮る、常備菜にもなる一品。" },
  { ingredient: "kanbutsu", method: "furaipan", style: "youfuu", name: "乾物のオイル蒸し炒め", desc: "戻した乾物をオリーブオイルとにんにくでさっと炒める。" },
  { ingredient: "kanbutsu", method: "furaipan", style: "chuuka", name: "乾物の中華風炒め", desc: "春雨やきくらげをごま油で炒める中華風の一皿。" },
  { ingredient: "kanbutsu", method: "furaipan", style: "ethnic", name: "乾物のエスニック風炒め", desc: "戻した春雨をナンプラーと唐辛子で炒めるエスニック風。" },

  { ingredient: "bousai", method: "renji", style: "wafuu", name: "備蓄食の和風レンジアレンジ", desc: "アルファ米やレトルトご飯を和風だしでレンジアレンジ。" },
  { ingredient: "bousai", method: "renji", style: "youfuu", name: "備蓄食の洋風チーズレンジアレンジ", desc: "缶詰パンやビスケットにチーズをのせてレンジで洋風軽食に。" },
  { ingredient: "bousai", method: "renji", style: "chuuka", name: "備蓄食の中華風レンジアレンジ", desc: "アルファ米にごま油と中華だしを加えてレンジで簡単中華風。" },
  { ingredient: "bousai", method: "renji", style: "ethnic", name: "備蓄食のエスニック風レンジアレンジ", desc: "レトルトご飯をナンプラーで和えてレンジ加熱するエスニック風。" },
  { ingredient: "bousai", method: "nabe", style: "wafuu", name: "備蓄食の和風雑炊鍋", desc: "アルファ米や乾パンを鍋でだし汁と煮て、温かい雑炊風に。" },
  { ingredient: "bousai", method: "nabe", style: "youfuu", name: "備蓄食の洋風スープ煮", desc: "レトルト食品とコンソメを鍋で煮込み、洋風スープに仕立てる。" },
  { ingredient: "bousai", method: "nabe", style: "chuuka", name: "備蓄食の中華風スープ煮", desc: "保存食を鶏がらスープで煮込む、体が温まる中華風の一杯。" },
  { ingredient: "bousai", method: "nabe", style: "ethnic", name: "備蓄食のエスニックスープ", desc: "保存食をナンプラーとレモンで煮込むエスニック風スープ。" },
  { ingredient: "bousai", method: "furaipan", style: "wafuu", name: "備蓄食の和風炒めアレンジ", desc: "乾パンやレトルト食品を醤油ベースでフライパン炒めに。" },
  { ingredient: "bousai", method: "furaipan", style: "youfuu", name: "備蓄食の洋風ソテーアレンジ", desc: "保存食をオリーブオイルとにんにくでフライパンソテーに。" },
  { ingredient: "bousai", method: "furaipan", style: "chuuka", name: "備蓄食の中華風炒めアレンジ", desc: "保存食をごま油とオイスターソースで中華風に炒める。" },
  { ingredient: "bousai", method: "furaipan", style: "ethnic", name: "備蓄食のエスニック炒めアレンジ", desc: "保存食をナンプラーと唐辛子でエスニック風に炒める。" },
];
