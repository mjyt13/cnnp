export const EVIDENCES = {
  // Название: [Описание, Общая_Вероятность_P(E)]
  SEVERITY: ['Тяжесть после еды', 0.75],
  EPIGASTRIC_DISCOMFORT: ['Дискомфорт в эпигастрии', 0.8],
  ERUCTATION: ['Отрыжка', 0.55],
  NAUSEA: ['Тошнота', 0.5],
  EARLY_SATURATION: ['Быстрое насыщение', 0.65],
  HUNGER_PAIN: ['Голодные боли', 0.25],
  NIGHT_PAIN: ['Ночные боли', 0.2],
  HEARTBURN: ['Изжога', 0.4],
  VOMITING: ['Рвота', 0.15],
  APPETITE_LOSS: ['Снижение аппетита', 0.35],
  WEIGHT_LOSS: ['Потеря веса', 0.05], // Красный флаг, низкая P(E)
  ACID_REFLUX: ['Кислый рефлюкс', 0.45],
};

export const HYPOTHESES = {
  // Название: [Описание, Априорная_Вероятность_P(H)]
  GASTRITIS: ['Хронический гастрит', 0.35, 'src/assets/gastritis.png'], // 35% - умеренное значение для симптоматического гастрита
  // [2, -1, -1, 0, -1, -2, -2, -1, 0, 1, -2, 0]
  DUODENAL_ULCER: ['Язвенная болезнь ДПК', 0.07, 'src/assets/duodenical_ulcer.png'], // 7%
  // [-1, 0, 0, 0, 0, 2, 2, -1, -1, 1, 0, -1]
  GASTRIC_ULCER: ['Язвенная болезнь желудка', 0.03, 'src/assets/gastric_ulcer.png'], // 3%
  // [-1, 0, 0, -2, -2, -1, -2, 0, -1, 2, 2, 1]
  GERD: ['ГЭРБ', 0.3, 'src/assets/gerd.png'], // 30%
  // [-1, 0, -1, -2, -1, -2, -2, 2, -1, 0, -1, 2]
  FUNCTIONAL_DYSPEPSIA: ['Функциональная диспепсия', 0.09, 'src/assets/functional_dyspepsia.png'], // 9%
  // [2, 2, -1, -2, 1, -2, -1, 1, -1, -1, -1, 2] - dorabotat
};

export const SENSITIVITY_MATRIX = {
  // ----------------------------------------------------
  // H1: Язвенная болезнь ДПК (Duodenal Ulcer)
  // ----------------------------------------------------
  DUODENAL_ULCER: {
    SEVERITY: 0.4, // Тяжесть: 30-50%
    EPIGASTRIC_DISCOMFORT: 0.6, // Дискомфорт: 50-70%
    ERUCTATION: 0.3, // Отрыжка: 20-40%
    NAUSEA: 0.3, // Тошнота: 20-40%
    EARLY_SATURATION: 0.15, // Быстрое насыщение: 10-20%
    HUNGER_PAIN: 0.8, // **Голодные боли: 70-90%** (Высоко специфично)
    NIGHT_PAIN: 0.7, // **Ночные боли: 60-80%** (Высоко специфично)
    HEARTBURN: 0.5, // Изжога: 40-60%
    VOMITING: 0.15, // Рвота: 10-20%
    APPETITE_LOSS: 0.25, // Снижение аппетита: 20-30%
    WEIGHT_LOSS: 0.05, // Потеря веса: 5-10% (Низко)
    ACID_REFLUX: 0.4, // Кислый рефлюкс: 30-50%
  },

  // ----------------------------------------------------
  // H2: Язвенная болезнь Желудка (Gastric Ulcer)
  // ----------------------------------------------------
  GASTRIC_ULCER: {
    SEVERITY: 0.5,
    EPIGASTRIC_DISCOMFORT: 0.7,
    ERUCTATION: 0.4,
    NAUSEA: 0.6,
    EARLY_SATURATION: 0.3,
    HUNGER_PAIN: 0.5, // Голодные боли: 40-60% (Ниже, чем при ЯДПК)
    NIGHT_PAIN: 0.4, // Ночные боли: 30-50%
    HEARTBURN: 0.4,
    VOMITING: 0.3,
    APPETITE_LOSS: 0.5, // **Снижение аппетита: 40-60%** (Чаще, чем при ЯДПК)
    WEIGHT_LOSS: 0.2, // Потеря веса: 15-25% (Выше, чем при ЯДПК)
    ACID_REFLUX: 0.3,
  },

  // ----------------------------------------------------
  // H3: ГЭРБ (Gastroesophageal Reflux Disease)
  // ----------------------------------------------------
  GERD: {
    SEVERITY: 0.25,
    EPIGASTRIC_DISCOMFORT: 0.35,
    ERUCTATION: 0.7, // Отрыжка: 60-80%
    NAUSEA: 0.15,
    EARLY_SATURATION: 0.15,
    HUNGER_PAIN: 0.08,
    NIGHT_PAIN: 0.08,
    HEARTBURN: 0.9, // **Изжога: 85-95%** (Ключевой симптом)
    VOMITING: 0.08,
    APPETITE_LOSS: 0.08,
    WEIGHT_LOSS: 0.03,
    ACID_REFLUX: 0.8, // **Кислый рефлюкс: 70-90%** (Ключевой симптом)
  },

  // ----------------------------------------------------
  // H4: Хронический гастрит (Gastritis)
  // ----------------------------------------------------
  GASTRITIS: {
    SEVERITY: 0.8, // **Тяжесть: 70-85%**
    EPIGASTRIC_DISCOMFORT: 0.85, // **Дискомфорт: 75-90%**
    ERUCTATION: 0.5,
    NAUSEA: 0.6,
    EARLY_SATURATION: 0.65, // Быстрое насыщение: 60-75%
    HUNGER_PAIN: 0.15,
    NIGHT_PAIN: 0.1,
    HEARTBURN: 0.3,
    VOMITING: 0.15,
    APPETITE_LOSS: 0.4,
    WEIGHT_LOSS: 0.08,
    ACID_REFLUX: 0.15,
  },

  // ----------------------------------------------------
  // H5: Функциональная диспепсия (Functional Dyspepsia)
  // Используется для P(E | ¬H_org)
  // ----------------------------------------------------
  FUNCTIONAL_DYSPEPSIA: {
    SEVERITY: 0.85, // Ключевой симптом постпрандиального дистресс-синдрома
    EPIGASTRIC_DISCOMFORT: 0.9, // Центральный симптом
    ERUCTATION: 0.6,
    NAUSEA: 0.5,
    EARLY_SATURATION: 0.7, // Ключевой симптом
    HUNGER_PAIN: 0.2, // Язвенноподобный вариант
    NIGHT_PAIN: 0.1,
    HEARTBURN: 0.5, // Рефлюксоподобный вариант
    VOMITING: 0.1,
    APPETITE_LOSS: 0.35,
    WEIGHT_LOSS: 0.01, // **Очень низко** (нет органической причины)
    ACID_REFLUX: 0.4,
  },
};

export const NOT_SENSIVITY_MATRIX = {
  GASTRITIS: {
    SEVERITY: 0.7230769230769231,
    EPIGASTRIC_DISCOMFORT: 0.7730769230769231,
    ERUCTATION: 0.576923076923077,
    NAUSEA: 0.4461538461538462,
    EARLY_SATURATION: 0.65,
    HUNGER_PAIN: 0.3038461538461539,
    NIGHT_PAIN: 0.25384615384615383,
    HEARTBURN: 0.4538461538461539,
    VOMITING: 0.15,
    APPETITE_LOSS: 0.32307692307692304,
    WEIGHT_LOSS: 0.03384615384615385,
    ACID_REFLUX: 0.6115384615384616,
  },
  DUODENAL_ULCER: {
    SEVERITY: 0.7763440860215054,
    EPIGASTRIC_DISCOMFORT: 0.8150537634408602,
    ERUCTATION: 0.5688172043010753,
    NAUSEA: 0.5150537634408602,
    EARLY_SATURATION: 0.6876344086021506,
    HUNGER_PAIN: 0.20860215053763442,
    NIGHT_PAIN: 0.1623655913978495,
    HEARTBURN: 0.39247311827956993,
    VOMITING: 0.15,
    APPETITE_LOSS: 0.35752688172043007,
    WEIGHT_LOSS: 0.05,
    ACID_REFLUX: 0.4537634408602151,
  },
  GASTRIC_ULCER: {
    SEVERITY: 0.7577319587628866,
    EPIGASTRIC_DISCOMFORT: 0.8030927835051547,
    ERUCTATION: 0.554639175257732,
    NAUSEA: 0.49690721649484537,
    EARLY_SATURATION: 0.6608247422680412,
    HUNGER_PAIN: 0.2422680412371134,
    NIGHT_PAIN: 0.19381443298969073,
    HEARTBURN: 0.4,
    VOMITING: 0.14536082474226802,
    APPETITE_LOSS: 0.34536082474226804,
    WEIGHT_LOSS: 0.04536082474226805,
    ACID_REFLUX: 0.45463917525773195,
  },
  GERD: {
    SEVERITY: 0.9642857142857144,
    EPIGASTRIC_DISCOMFORT: 0.992857142857143,
    ERUCTATION: 0.4857142857142859,
    NAUSEA: 0.65,
    EARLY_SATURATION: 0.8642857142857143,
    HUNGER_PAIN: 0.3228571428571429,
    NIGHT_PAIN: 0.25142857142857145,
    HEARTBURN: 0.18571428571428572,
    VOMITING: 0.18000000000000002,
    APPETITE_LOSS: 0.4657142857142857,
    WEIGHT_LOSS: 0.05857142857142858,
    ACID_REFLUX: 0.30000000000000004,
  },
  FUNCTIONAL_DYSPEPSIA: {
    SEVERITY: 0.74010989010989,
    EPIGASTRIC_DISCOMFORT: 0.7901098901098902,
    ERUCTATION: 0.5450549450549451,
    NAUSEA: 0.5,
    EARLY_SATURATION: 0.645054945054945,
    HUNGER_PAIN: 0.2549450549450549,
    NIGHT_PAIN: 0.2098901098901099,
    HEARTBURN: 0.3901098901098901,
    VOMITING: 0.15494505494505492,
    APPETITE_LOSS: 0.35,
    WEIGHT_LOSS: 0.05395604395604396,
    ACID_REFLUX: 0.454945054945055,
  },
};

export const DISTRIBUTION_MATRIX = {
  // ----------------------------------------------------
  // H1: Язвенная болезнь ДПК (Duodenal Ulcer)
  // ----------------------------------------------------
  DUODENAL_ULCER: {
    SEVERITY: { mu: 0.8, sigma: 1.0 },
    EPIGASTRIC_DISCOMFORT: { mu: 1.2, sigma: 0.8 },
    ERUCTATION: { mu: 0.1, sigma: 1.0 },
    NAUSEA: { mu: 0.3, sigma: 1.0 },
    EARLY_SATURATION: { mu: -0.5, sigma: 1.0 },
    HUNGER_PAIN: { mu: 1.7, sigma: 0.6 }, // Высокая специфичность
    NIGHT_PAIN: { mu: 1.5, sigma: 0.7 }, // Высокая специфичность
    HEARTBURN: { mu: 0.5, sigma: 1.0 },
    VOMITING: { mu: -0.8, sigma: 0.8 },
    APPETITE_LOSS: { mu: 0.0, sigma: 1.0 },
    WEIGHT_LOSS: { mu: -1.5, sigma: 0.5 },
    ACID_REFLUX: { mu: 0.3, sigma: 1.0 },
  },

  // ----------------------------------------------------
  // H2: Язвенная болезнь Желудка (Gastric Ulcer)
  // ----------------------------------------------------
  GASTRIC_ULCER: {
    SEVERITY: { mu: 1.0, sigma: 1.0 },
    EPIGASTRIC_DISCOMFORT: { mu: 1.5, sigma: 0.7 },
    ERUCTATION: { mu: 0.5, sigma: 1.0 },
    NAUSEA: { mu: 1.2, sigma: 0.8 },
    EARLY_SATURATION: { mu: 0.5, sigma: 1.0 },
    HUNGER_PAIN: { mu: 0.5, sigma: 1.0 },
    NIGHT_PAIN: { mu: 0.3, sigma: 1.0 },
    HEARTBURN: { mu: 0.4, sigma: 1.0 },
    VOMITING: { mu: 0.0, sigma: 0.8 },
    APPETITE_LOSS: { mu: 1.5, sigma: 1.0 }, // Красный флаг
    WEIGHT_LOSS: { mu: 1.5, sigma: 0.8 }, // Красный флаг
    ACID_REFLUX: { mu: 0.1, sigma: 1.0 },
  },

  // ----------------------------------------------------
  // H3: ГЭРБ (GERD)
  // ----------------------------------------------------
  GERD: {
    SEVERITY: { mu: -0.5, sigma: 1.0 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.0, sigma: 1.0 },
    ERUCTATION: { mu: 1.5, sigma: 0.8 },
    NAUSEA: { mu: -1.0, sigma: 0.8 },
    EARLY_SATURATION: { mu: -1.0, sigma: 0.8 },
    HUNGER_PAIN: { mu: -1.5, sigma: 0.5 },
    NIGHT_PAIN: { mu: -1.5, sigma: 0.5 },
    HEARTBURN: { mu: 1.8, sigma: 0.5 }, // Высокая специфичность
    VOMITING: { mu: -1.5, sigma: 0.5 },
    APPETITE_LOSS: { mu: -1.5, sigma: 0.5 },
    WEIGHT_LOSS: { mu: -1.8, sigma: 0.3 },
    ACID_REFLUX: { mu: 1.8, sigma: 0.5 }, // Высокая специфичность
  },

  // ----------------------------------------------------
  // H4: Хронический гастрит (Gastritis)
  // ----------------------------------------------------
  GASTRITIS: {
    SEVERITY: { mu: 0.3, sigma: 0.9 },
    EPIGASTRIC_DISCOMFORT: { mu: 1.5, sigma: 0.7 },
    ERUCTATION: { mu: 0.8, sigma: 1.0 },
    NAUSEA: { mu: 0.0, sigma: 1.0 },
    EARLY_SATURATION: { mu: 1.2, sigma: 0.8 },
    HUNGER_PAIN: { mu: -0.5, sigma: 1.0 },
    NIGHT_PAIN: { mu: -0.8, sigma: 0.8 },
    HEARTBURN: { mu: 0.0, sigma: 1.0 },
    VOMITING: { mu: -0.5, sigma: 0.8 },
    APPETITE_LOSS: { mu: 0.3, sigma: 1.0 },
    WEIGHT_LOSS: { mu: -1.5, sigma: 0.5 },
    ACID_REFLUX: { mu: -0.5, sigma: 1.0 },
  },

  // ----------------------------------------------------
  // H5: Функциональная диспепсия (FD) — База для P(L_i | ¬H_орг)
  // ----------------------------------------------------
  FUNCTIONAL_DYSPEPSIA: {
    SEVERITY: { mu: 1.5, sigma: 0.8 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.9, sigma: 0.5 },
    ERUCTATION: { mu: 1.0, sigma: 1.0 },
    NAUSEA: { mu: 1.6, sigma: 1.0 },
    EARLY_SATURATION: { mu: 0.6, sigma: 0.7 },
    HUNGER_PAIN: { mu: -1.0, sigma: 1.5 }, // Распределение очень широкое
    NIGHT_PAIN: { mu: -1.5, sigma: 1.0 },
    HEARTBURN: { mu: 0.8, sigma: 1.2 },
    VOMITING: { mu: -1.0, sigma: 0.8 },
    APPETITE_LOSS: { mu: 0.0, sigma: 1.0 },
    WEIGHT_LOSS: { mu: -2.0, sigma: 0.1 }, // Практически нулевая вероятность при ФД
    ACID_REFLUX: { mu: 0.5, sigma: 1.0 },
  },
};

export const NOT_H_DISTRIBUTION_MATRIX = {
  GASTRITIS: {
    SEVERITY: { mu: 0.10923076923076924, sigma: 1.1095637379918122 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.43384615384615377, sigma: 1.0136300242823 },
    ERUCTATION: { mu: 0.8646153846153846, sigma: 0.9195957236458072 },
    NAUSEA: { mu: -0.2630769230769231, sigma: 1.0541057685661972 },
    EARLY_SATURATION: { mu: -0.29846153846153844, sigma: 1.0946343085516514 },
    HUNGER_PAIN: { mu: -0.48615384615384616, sigma: 1.2564051861589116 },
    NIGHT_PAIN: { mu: -0.5861538461538461, sigma: 1.1154186324133286 },
    HEARTBURN: { mu: 1.0138461538461538, sigma: 0.8977869721867828 },
    VOMITING: { mu: -0.9169230769230768, sigma: 0.7075354598504836 },
    APPETITE_LOSS: { mu: -0.6692307692307692, sigma: 0.9484606506472086 },
    WEIGHT_LOSS: { mu: -1.246153846153846, sigma: 0.6836007373740688 },
    ACID_REFLUX: { mu: 0.9369230769230769, sigma: 0.9240894643855858 },
  },
  DUODENAL_ULCER: {
    SEVERITY: { mu: 0.5053763440860215, sigma: 1.1785302850172719 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.8150537634408602, sigma: 1.0462936250557135 },
    ERUCTATION: { mu: 0.8978494623655914, sigma: 0.9157019246631094 },
    NAUSEA: { mu: 0.16989247311827957, sigma: 1.2139595026370298 },
    EARLY_SATURATION: { mu: 0.2806451612903226, sigma: 1.2294109700082745 },
    HUNGER_PAIN: { mu: -0.6559139784946237, sigma: 1.015237018551506 },
    NIGHT_PAIN: { mu: -0.8236559139784946, sigma: 0.8057148829678565 },
    HEARTBURN: { mu: 0.6709677419354839, sigma: 1.1014577317127827 },
    VOMITING: { mu: -0.7688172043010754, sigma: 0.7924529197670702 },
    APPETITE_LOSS: { mu: -0.3548387096774194, sigma: 1.098267229670705 },
    WEIGHT_LOSS: { mu: -1.3225806451612903, sigma: 0.6177923550479312 },
    ACID_REFLUX: { mu: 0.4440860215053764, sigma: 1.2323325596741996 },
  },
  GASTRIC_ULCER: {
    SEVERITY: { mu: 0.511340206185567, sigma: 1.1707078873146262 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.8216494845360826, sigma: 1.0368111802340614 },
    ERUCTATION: { mu: 0.8525773195876288, sigma: 0.9472240848764868 },
    NAUSEA: { mu: 0.1474226804123711, sigma: 1.1976528614439075 },
    EARLY_SATURATION: { mu: 0.21752577319587627, sigma: 1.2385688731520712 },
    HUNGER_PAIN: { mu: -0.5216494845360825, sigma: 1.1621196645403618 },
    NIGHT_PAIN: { mu: -0.6907216494845361, sigma: 0.9964788891958984 },
    HEARTBURN: { mu: 0.6670103092783505, sigma: 1.097776520112749 },
    VOMITING: { mu: -0.7948453608247423, sigma: 0.7764507958230269 },
    APPETITE_LOSS: { mu: -0.3556701030927835, sigma: 1.0881525149297706 },
    WEIGHT_LOSS: { mu: -1.3917525773195876, sigma: 0.4774480948552088 },
    ACID_REFLUX: { mu: 0.4443298969072165, sigma: 1.2227251822914194 },
  },
  GERD: {
    SEVERITY: { mu: 0.9657142857142857, sigma: 0.8517716744660746 },
    EPIGASTRIC_DISCOMFORT: { mu: 1.2028571428571428, sigma: 0.7005057731328271 },
    ERUCTATION: { mu: 0.56, sigma: 0.9200186333516761 },
    NAUSEA: { mu: 0.6842857142857143, sigma: 0.9130855324143369 },
    EARLY_SATURATION: { mu: 0.7514285714285714, sigma: 0.9269037457772301 },
    HUNGER_PAIN: { mu: -0.05857142857142853, sigma: 1.1351838576506248 },
    NIGHT_PAIN: { mu: -0.30142857142857143, sigma: 1.0048888368093376 },
    HEARTBURN: { mu: 0.17000000000000004, sigma: 0.9521749539119073 },
    VOMITING: { mu: -0.45857142857142863, sigma: 0.7435941006953467 },
    APPETITE_LOSS: { mu: 0.17142857142857143, sigma: 0.8894031149454311 },
    WEIGHT_LOSS: { mu: -1.1357142857142857, sigma: 0.6848687388867835 },
    ACID_REFLUX: { mu: -0.1514285714285714, sigma: 0.9538490996778622 },
  },
  FUNCTIONAL_DYSPEPSIA: {
    SEVERITY: { mu: 0.4296703296703297, sigma: 1.1613085866161572 },
    EPIGASTRIC_DISCOMFORT: { mu: 0.7571428571428572, sigma: 1.0387577758923878 },
    ERUCTATION: { mu: 0.8263736263736263, sigma: 0.9483960396539554 },
    NAUSEA: { mu: 0.11758241758241755, sigma: 1.2025186852084908 },
    EARLY_SATURATION: { mu: 0.10989010989010983, sigma: 1.2098854978112523 },
    HUNGER_PAIN: { mu: -0.5395604395604395, sigma: 1.1197506341830978 },
    NIGHT_PAIN: { mu: -0.676923076923077, sigma: 1.012123981614045 },
    HEARTBURN: { mu: 0.6450549450549451, sigma: 1.0864183549073214 },
    VOMITING: { mu: -0.7483516483516484, sigma: 0.7921785909325608 },
    APPETITE_LOSS: { mu: -0.3626373626373627, sigma: 1.0985948734057434 },
    WEIGHT_LOSS: { mu: -1.2692307692307692, sigma: 0.6219315730784063 },
    ACID_REFLUX: { mu: 0.4274725274725275, sigma: 1.2383860220012648 },
  },
};

export const MODES = {
  ENTRY: 'ENTRY',
  SURVEY: 'SURVEY',
  RESULT: 'RESULT',
};

// --- КОМБИНИРОВАННЫЕ СПИСКИ (Для итерации по вопросам) ---
// Эти массивы удобно использовать в JSX для итерации по вопросам.
export const EVIDENCES_NAMES_ARRAY = Object.values(EVIDENCES);
export const HYPOTHESES_NAMES_ARRAY = Object.values(HYPOTHESES);
export const MODES_NAMES = Object.values(MODES);
