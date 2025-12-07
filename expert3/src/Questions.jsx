import { useState, useEffect } from 'react';
import './Questions.css';
import { COLORS, SIZES, EFFECTS, COLOR_NAMES_ARRAY, SIZE_NAMES_ARRAY, EFFECT_NAMES_ARRAY, MODES } from './constants';

export const Questions = () => {
  const [mode, setMode] = useState(MODES.READY);
  const [strictMode, setStrictMode] = useState(true);
  const [index, setIndex] = useState(0);
  const [finalResult, setFinalResult] = useState('');
  const [results, setResults] = useState([]);
  const [finalResultImage, setFinalResultImage] = useState(null);
  const [resultsImages, setResultsImages] = useState([]);
  const [absolute, setAbsolute] = useState(false);

  // ФАКТЫ
  const [approved, setApproved] = useState([]);
  const [disapproved, setDisapproved] = useState([]);

  const rules = [
    {
      name: 'Cloud9 Holo | Antwerp 2022',
      conditions: [COLORS.BLUE, SIZES.MEDIUM, EFFECTS.HOLOGRAPHIC],
      notConditions: [COLORS.RED, COLORS.YELLOW, EFFECTS.METALLIC, EFFECTS.LENTICULAR],
      imagePath: './assets/results/cloud9_holo_antwerp_2022.png',
    },
    {
      name: 'GamerLegion (Holo) | Shanghai 2024',
      conditions: [COLORS.BLUE, SIZES.LARGE, EFFECTS.HOLOGRAPHIC],
      notConditions: [COLORS.WHITE, EFFECTS.GLITTER],
      imagePath: './assets/results/gamerlegion_holo_shanghai_2024.png',
    },
    {
      name: 'Bolt Strike (Foil)',
      conditions: [COLORS.PURPLE, SIZES.LARGE, EFFECTS.METALLIC],
      notConditions: [COLORS.RED, COLORS.YELLOW, SIZES.SMALL, EFFECTS.GLITTER, EFFECTS.LENTICULAR],
      imagePath: './assets/results/bolt_strike_foil.png',
    },
    {
      name: 'Bolt Charge',
      conditions: [COLORS.YELLOW, SIZES.LARGE],
      notConditions: [COLORS.BLUE, COLORS.RED, SIZES.SMALL, EFFECTS.HOLOGRAPHIC, EFFECTS.GLITTER, EFFECTS.LENTICULAR],
      imagePath: './assets/results/bolt_charge.png',
    },
    {
      name: 'Eternal Fire (Glitter) | Antwerp 2022',
      conditions: [COLORS.BLUE, SIZES.MEDIUM, EFFECTS.GLITTER],
      notConditions: [COLORS.ORANGE, COLORS.YELLOW, EFFECTS.METALLIC, EFFECTS.LENTICULAR],
      imagePath: './assets/results/eternal_fire_glitter_antwerp_2022.png',
    },
    {
      name: 'Evil Geniuses (Foil) | Stockholm 2021',
      conditions: [COLORS.BLACK, SIZES.MEDIUM, EFFECTS.METALLIC],
      notConditions: [COLORS.GREEN, COLORS.YELLOW, EFFECTS.HOLOGRAPHIC, EFFECTS.LENTICULAR],
      imagePath: './assets/results/evil_geniuses_foil_stockholm_2021.png',
    },
    {
      name: 'Fluxo (Glitter) | Paris 2023',
      conditions: [COLORS.BLACK, SIZES.MEDIUM, EFFECTS.GLITTER],
      notConditions: [COLORS.WHITE, COLORS.YELLOW, EFFECTS.METALLIC],
      imagePath: './assets/results/fluxo_glitter_paris_2023.png',
    },
    {
      name: 'Furia (Holo) | Berlin 2019',
      conditions: [COLORS.BLACK, SIZES.LARGE],
      notConditions: [COLORS.RED, EFFECTS.GLITTER],
      imagePath: './assets/results/furia_berlin_holo_berlin_2019.png',
    },
    {
      name: 'Hydro Geyser',
      conditions: [COLORS.BLUE, SIZES.MEDIUM],
      notConditions: [COLORS.RED, COLORS.PURPLE, EFFECTS.HOLOGRAPHIC, EFFECTS.LENTICULAR],
      imagePath: './assets/results/hydro_geyser.png',
    },
    {
      name: 'IHC (Holo) | Antwerp 2022',
      conditions: [COLORS.WHITE, SIZES.MEDIUM, EFFECTS.HOLOGRAPHIC],
      notConditions: [COLORS.RED, COLORS.BLACK, EFFECTS.GLITTER],
      imagePath: './assets/results/ihc_holo_antwerp_2022.png',
    },
    {
      name: 'PaiN (Foil) | Stockholm 2021',
      conditions: [COLORS.WHITE, SIZES.MEDIUM, EFFECTS.METALLIC],
      notConditions: [COLORS.GREEN, COLORS.BLUE, EFFECTS.HOLOGRAPHIC],
      imagePath: './assets/results/evil_geniuses_foil_stockholm_2021.png',
    },
    {
      name: 'Ruby Stream (Lenticular)',
      conditions: [COLORS.RED, SIZES.MEDIUM, EFFECTS.LENTICULAR],
      notConditions: [COLORS.GREEN, COLORS.BLUE, EFFECTS.GLITTER],
      imagePath: './assets/results/ruby_stream_lenticular.png',
    },
    {
      name: 'Scorch Loop',
      conditions: [COLORS.ORANGE, COLORS.RED, SIZES.LARGE],
      notConditions: [COLORS.BLUE, COLORS.PURPLE],
      imagePath: './assets/results/scorch_loop.png',
    },
    {
      name: 'Spirit (Glitter) | Copenhagen 2024',
      conditions: [COLORS.WHITE, SIZES.LARGE, EFFECTS.GLITTER],
      notConditions: [COLORS.BLUE, COLORS.YELLOW, EFFECTS.METALLIC],
      imagePath: './assets/results/spirit_copenhagen_2024.png',
    },
    {
      name: 'С такими запросами доступных наклеек нет',
      conditions: [],
      notConditions: [],
      imagePath: './assets/results/placeholder.png',
    },
  ];

  // суть продукционной системы (версия с баллами)
  const checkRulesAndHalt = async () => {
    let bestMatch = { name: null, score: -1 };
    console.log(approved, disapproved, index, mode, results);

    for (const rule of rules) {
      // 1. СТРОГАЯ ПРОВЕРКА НА ПРОТИВОРЕЧИЯ
      const hasContradiction = rule.notConditions.some(fact => approved.includes(fact));

      if (hasContradiction) {
        console.log(`rule ${rule.name} IS BANNED`);
        continue; // Правило исключается, если одобрен хоть один запрещенный факт
      }

      // 2. ПОДСЧЕТ СОВПАДЕНИЙ (Score)
      const matchedConditions = rule.conditions.filter(fact => approved.includes(fact));
      const matchedNotConditions = rule.notConditions.filter(fact => disapproved.includes(fact));

      const score = matchedConditions.length;
      const addScore = matchedNotConditions.length;

      const requiredConditionsCount = rule.conditions.length;
      const requiredNotConditionsCount = rule.notConditions.length;

      // console.warn(matchedConditions, score, requiredConditionsCount, matchedNotConditions, addScore, requiredNotConditionsCount);
      // Приоритет: 1 - Полное совпадение
      if (score === requiredConditionsCount && addScore === requiredNotConditionsCount && score > 0) {
        console.log(rule);
        setMode('result');
        setAbsolute(true);
        return rule.name; // Найдено идеальное совпадение, прерываем опрос
      }

      // ПРиоритет 2 - Совпадение по всем подходящим
      if (score === requiredConditionsCount && addScore != requiredNotConditionsCount && score > 0) {
        if (!results.includes(rule.name)) {
          console.log(`alright, rule ${rule.name} is working here`);
          setResults(prev => [...prev, rule.name]);
        }
      }

      // Приоритет: 3 - Частичное совпадение
      // Устанавливаем минимальный порог
      // if (strictMode) console.warn(`it's not good ${bestMatch.name} ${bestMatch.score}`);
      if (score === requiredConditionsCount - 1 && score > bestMatch.score && !strictMode) {
        console.log(`strict mode is off and we got something ${rule.name}`);
        bestMatch = { name: rule.name, score: score };
      }
    }

    // Если здесь возвращается имя, то опрос прерывается,
    // если вы хотите продолжать, пока нет 100% совпадения,
    // то этот блок лучше разместить в другом месте.

    // В данном случае, возвращаем null, чтобы опрос продолжался,
    // пока не дойдет до конца, или не будет 100% совпадения.
    if (!strictMode) bestMatch = { name: rules[rules.length - 1].name, score: 0 };
    return bestMatch.name;
  };

  // Запуск при изменении
  useEffect(() => {
    const change = async () => {
      // Эта функция будет запущена после того, как React обновит approved/disapproved
      // и перерисует компонент.

      // Убедитесь, что опрос еще не завершен (иначе при выходе из 'result' будет ошибка)
      if (mode === MODES.RESULT || mode === MODES.READY) return;

      // console.log(`bc of here`);
      const result = await checkRulesAndHalt();

      if (result) {
        // Устанавливаем итоговый результат и переключаем режим
        setFinalResult(result);
        setMode('result');
        // Не нужно менять index, так как мы перешли в режим 'result'
      }
    };
    change();
  }, [approved, disapproved, mode]); // Зависимости: запускать при изменении этих состояний

  // смена состояний
  useEffect(() => {
    const changeMode = async () => {
      if (mode == MODES.COLOR && index == colors.length && colors.length > 0) {
        setMode(MODES.SIZE);
        setIndex(0);
      }
      if (mode == MODES.SIZE && index == sizes.length && sizes.length > 0) {
        setMode(MODES.EFFECT);
        setIndex(0);
      }
      if (mode == MODES.EFFECT && index == effects.length && effects.length > 0) {
        // Пересчитайте баллы в конце, чтобы получить лучший нестрогий результат
        // let bestMatchAtEnd = { name: 'Нет точного результата', score: -1 };

        // for (const rule of rules) {
        //   const hasContradiction = rule.notConditions.some(fact => approved.includes(fact));
        //   if (hasContradiction) continue;

        //   const matchedConditions = rule.conditions.filter(fact => approved.includes(fact));
        //   const score = matchedConditions.length;

        //   if (score > bestMatchAtEnd.score) {
        //     bestMatchAtEnd = { name: rule.name, score: score };
        //   }
        // }
        if (results.length > 0) {
          if (results.length == 1) {
            setFinalResult(results[0]);
          }
          // Переход к результату
          setMode(MODES.RESULT);
          setIndex(0);
          return;
        }
        if (strictMode === true) {
          console.log(`cannot find something good, let's turn off strict mode`);
          setStrictMode(false);
          return;
        }
        if (strictMode === false) {
          const result = await checkRulesAndHalt();
          setMode(MODES.RESULT);
          setFinalResult(result || 'Не найдено');
          return;
        }

        // Устанавливаем лучший найденный результат
        // setFinalResult(bestMatchAtEnd.name);
        console.log(result, results, resultsImages);
      }
    };
    changeMode();
  }, [index, mode, approved, rules]);

  // Фото финалочки
  useEffect(() => {
    if (mode == MODES.RESULT) {
      setFinalResultImage(null);
      setResultsImages([]);
      if (results.length > 1) {
        const imagePromises = results
          .map(result => {
            const rule = rules.find(r => r.name === result);
            if (rule && rule.imagePath) {
              // Возвращаем Promise для динамического импорта
              return import(/* @vite-ignore */ rule.imagePath).then(mod => mod.default);
            }
            return null; // или путь к заглушке
          })
          .filter(p => p !== null); // Отфильтровываем пустые

        // Ждем, пока все импорты завершатся
        Promise.all(imagePromises).then(imageUrls => {
          setResultsImages(imageUrls);
        });
      } else if (finalResult) {
        // Находим сработавшее правило по имени
        const rule = rules.find(r => r.name === finalResult);
        if (rule && rule.imagePath) {
          // Динамический импорт изображения результата
          import(/* @vite-ignore */ rule.imagePath)
            .then(mod => {
              // mod.default — это фактический URL
              setFinalResultImage(mod.default);
            })
            .catch(error => {
              console.error('Failed to load result image:', error);
              // Можно установить placeholder
            });
        }
      }
    }
  }, [finalResult, results, mode]); // Зависит от finalResult и rules

  // ЦВЕТА
  const color_names = COLOR_NAMES_ARRAY;
  const [colors, setColors] = useState([]);
  useEffect(() => {
    const importImages = async () => {
      const modules = import.meta.glob('/src/assets/color/*', { eager: true });
      const imageUrls = Object.values(modules).map(mod => mod.default);
      setColors(imageUrls);
    };
    importImages();
  }, []);

  // РАЗМЕР
  const [sizes, setSizes] = useState([]);
  const size_names = SIZE_NAMES_ARRAY;
  useEffect(() => {
    const importImages = async () => {
      const modules = import.meta.glob('/src/assets/size/*', { eager: true });
      const imageUrls = Object.values(modules).map(mod => mod.default);
      setSizes(imageUrls);
    };
    importImages();
  }, []);

  // ЭФФЕКТ
  const [effects, setEffects] = useState([]);
  const effect_names = EFFECT_NAMES_ARRAY;
  useEffect(() => {
    const importImages = async () => {
      const modules = import.meta.glob('/src/assets/effect/*', { eager: true });
      const imageUrls = Object.values(modules).map(mod => mod.default);
      setEffects(imageUrls);
    };
    importImages();
  }, []);

  const handleChoice = choice => {
    let currentFact = '';
    switch (mode) {
      case 'color':
        currentFact = color_names[index];
        break;
      case 'size':
        currentFact = size_names[index];
        break;
      case 'effect':
        currentFact = effect_names[index];
        break;
      default:
        break;
    }

    if (currentFact) {
      if (choice === 'yes') {
        setApproved(prev => [...prev, currentFact]);
      } else if (choice === 'no') {
        setDisapproved(prev => [...prev, currentFact]);
      }
    }

    setIndex(prevIndex => prevIndex + 1);
  };

  const handleReset = () => {
    setMode(MODES.READY);
    setStrictMode(true);
    const idx = Math.floor(Math.random() * 100) % 2;
    console.log(idx);
    setIndex(0);
    setAbsolute(false);
    setStartText(res[idx]);
    setApproved([]);
    setDisapproved([]);
    setResults([]);
    setResultsImages([]);
    setFinalResult('');
    setFinalResultImage(null);
  };

  const res = ['красивая наклейка', 'ничего из этого не имело смысла'];
  const [startText, setStartText] = useState(res[0]);

  return (
    <>
      <div className="question">
        {mode == MODES.COLOR && <img className="sticker" src={colors[index]} alt="sticker_image" />}
        {mode == MODES.SIZE && <img className="sticker" src={sizes[index]} alt="sticker_image" />}
        {mode == MODES.EFFECT && <img className="sticker" src={effects[index]} alt="sticker_image" />}
        {mode == MODES.RESULT && results.length <= 1 && (
          <>
            <h2>{absolute ? `Самый лучший выбор:` : results.length == 1 ? `Весьма подходяще ` : ``}</h2>
            <img className="sticker" src={finalResultImage} alt="sticker_image" />
          </>
        )}

        {mode == MODES.COLOR && <h1>{`${color_names[index]}`}</h1>}
        {mode == MODES.SIZE && <h1>{`${size_names[index]}`}</h1>}
        {mode == MODES.EFFECT && <h1>{`${effect_names[index]}`}</h1>}
        {mode == MODES.RESULT && results.length <= 1 && (
          <>
            <h1>{`${finalResult}`}</h1>
            {/* {approved.map(fact => (
              <h3 key={Math.floor(Math.random() * 10000)}>{fact}</h3>
            ))}
            {disapproved.map(fact => (
              <h6 key={Math.floor(Math.random() * 10000)}>{fact}</h6>
            ))} */}
            <button onClick={handleReset}>Пройти заново</button>
          </>
        )}
        {mode == MODES.RESULT && results.length > 1 && (
          <div className="results">
            <h2>Это хорошие варианты, посмотрите</h2>
            {results.map(
              (
                result,
                index // <--- ИСПОЛЬЗУЙТЕ КРУГЛЫЕ СКОБКИ или 'return'
              ) => (
                <div key={result + index} className="result-item">
                  {/* Убедитесь, что image URLs уже загружены */}
                  <img className="sticker" src={resultsImages[index]} alt={result} />
                  <h2>{`${result}`}</h2>
                </div>
              )
            )}
            <button onClick={() => handleReset}>Пройти заново</button>
          </div>
        )}
        {mode != MODES.RESULT && mode != MODES.READY && (
          <div className="card">
            <button
              onClick={() => {
                handleChoice('yes');
              }}
            >
              Да
            </button>
            <button
              onClick={() => {
                handleChoice('no');
              }}
            >
              Нет
            </button>
            <button onClick={() => handleChoice('maybe')}>Возможно</button>
          </div>
        )}
        {mode == MODES.READY && (
          <>
            <h1>Выбор наклейки</h1>
            <h4>Цвет, размер и эффект - в конечном итоге {startText}</h4>
            <button onClick={() => setMode(MODES.COLOR)}>Начать</button>
          </>
        )}
      </div>
    </>
  );
};
