import {
  HYPOTHESES,
  EVIDENCES,
  SENSITIVITY_MATRIX,
  DISTRIBUTION_MATRIX,
  NOT_H_DISTRIBUTION_MATRIX,
  MODES,
  HYPOTHESES_NAMES_ARRAY,
} from './constants';
import { useEffect, useState } from 'react';
export const Evidences = () => {
  const allEvidencesKeys = Object.keys(EVIDENCES);
  const allHypoKeys = Object.keys(HYPOTHESES);
  const [evidenceNumber, setEvidenceNumber] = useState(0);
  const button_texts = [-2, -1, 0, 1, 2];
  const [hypoProbabilities, setHypoProbabilities] = useState(HYPOTHESES);
  const [userAnswers, setUserAnswers] = useState([]);
  const [mode, setMode] = useState('ENTRY');
  const [result, setResult] = useState();
  const [answers, setAnswers] = useState([]);

  const calculatePE_notH_Matrix = () => {
    const peNotHMatrix = {};

    // 1. Итерация по всем Гипотезам (H)
    for (const hypothesisKey in HYPOTHESES) {
      if (!HYPOTHESES.hasOwnProperty(hypothesisKey)) continue;

      // Получаем априорные вероятности для текущей гипотезы H
      const p_H = HYPOTHESES[hypothesisKey][1]; // P(H)
      const p_notH = 1 - p_H; // P(не H)

      // Инициализируем объект для текущей гипотезы
      peNotHMatrix[hypothesisKey] = {};

      // 2. Итерация по всем Свидетельствам (E)
      for (const evidenceKey in EVIDENCES) {
        if (!EVIDENCES.hasOwnProperty(evidenceKey)) continue;

        // Получаем фиксированную общую вероятность симптома
        const p_E = EVIDENCES[evidenceKey][1]; // P(E)

        // Получаем чувствительность (вероятность E при H) из SENSITIVITY_MATRIX
        const p_E_given_H = SENSITIVITY_MATRIX[hypothesisKey][evidenceKey]; // P(E | H)

        // 3. Расчет по формуле
        // P(E | не H) = [ P(E) - P(E | H) * P(H) ] / P(не H)

        // Совместная вероятность P(E и H)
        const p_E_and_H = p_E_given_H * p_H;

        // Совместная вероятность P(E и не H)
        const p_E_and_notH = p_E - p_E_and_H;

        // Условная вероятность P(E | не H)
        // Предотвращаем деление на ноль, хотя P(не H) должно быть близко к 1
        const p_E_given_notH = p_E_and_notH / p_notH;

        // 4. Сохраняем результат
        peNotHMatrix[hypothesisKey][evidenceKey] = p_E_given_notH;
      }
    }

    return peNotHMatrix;
  };

  // Функция для расчета плотности нормального распределения
  const normalPDF = (x, mu, sigma) => {
    // Защита от нулевого сигма
    if (sigma === 0) return x === mu ? 1.0 : 0.0;
    const exponent = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return exponent / (sigma * Math.sqrt(2 * Math.PI));
  };

  // Предполагая, что вы используете новую константу NOT_H_DISTRIBUTION_MATRIX
  // для рассчитанных P(L_i | ¬H_A)

  const handleAnswer = userLevel => {
    // 1. Сохраняем ответ пользователя (для отслеживания)
    const currentSymptomKey = allEvidencesKeys[evidenceNumber];
    setUserAnswers(prev => ({ ...prev, [currentSymptomKey]: userLevel }));

    // 2. Рассчитываем и обновляем апостериорную вероятность (числитель)
    const newHypoProbabilities = {};

    for (const hypoKey of allHypoKeys) {
      const P_H_current = hypoProbabilities[hypoKey]; // Текущая вероятность P(H|E1..Ei-1)

      // ----------- Расчет для H (P(L|H)) -----------
      const { mu: mu_H, sigma: sigma_H } = DISTRIBUTION_MATRIX[hypoKey][currentSymptomKey];
      const L_H = normalPDF(userLevel, mu_H, sigma_H); // Правдоподобие при H

      // ----------- Расчет для ¬H (P(L|¬H)) -----------
      // Используем вашу рассчитанную матрицу notH_Distributions
      const { mu: mu_notH, sigma: sigma_notH } = NOT_H_DISTRIBUTION_MATRIX[hypoKey][currentSymptomKey];
      const L_notH = normalPDF(userLevel, mu_notH, sigma_notH); // Правдоподобие при ¬H

      // ----------- Применение Закона Полной Вероятности для P(L) -----------
      // P(L) = P(L|H) * P(H_current) + P(L|¬H) * P(¬H_current)
      // P(H_current) - это текущая вероятность P(H|E1..Ei-1)
      // P(¬H_current) = 1 - P(H_current)

      const P_L = L_H * P_H_current[1] + L_notH * (1 - P_H_current[1]);

      // ----------- Обновление P(H) по Теореме Байеса -----------
      // P(H|E1..Ei) = P(L|H) * P(H|E1..Ei-1) / P(L)
      const P_H_new = (L_H * P_H_current[1]) / P_L;

      newHypoProbabilities[hypoKey] = [];
      newHypoProbabilities[hypoKey][0] = P_H_current[0];
      newHypoProbabilities[hypoKey][1] = P_H_new;
      newHypoProbabilities[hypoKey][2] = P_H_current[2];
      // console.log(`hypoKey:${hypoKey},P_H_current:${P_H_current} L_H:${L_H}, L_notH:${L_notH}`);
    }

    // 3. Вы должны повторно нормализовать все вероятности, чтобы гарантировать,
    // что сумма всех P(H) равна 1, так как ошибки округления могут накапливаться.

    // Однако, использование вышеприведенной формулы Байеса (деление на P(L))
    // уже обеспечивает нормализацию относительно предыдущего шага,
    // если сумма P(H) на предыдущем шаге была 1.

    // Для большей устойчивости, я рекомендую использовать формулу через числитель:

    let finalTotalPosterior = 0;
    for (const hypoKey of allHypoKeys) {
      finalTotalPosterior += newHypoProbabilities[hypoKey][1];
    }

    const normalizedProbabilities = {};
    for (const hypoKey of allHypoKeys) {
      normalizedProbabilities[hypoKey] = [];
      normalizedProbabilities[hypoKey][0] = newHypoProbabilities[hypoKey][0];
      normalizedProbabilities[hypoKey][1] = newHypoProbabilities[hypoKey][1] / finalTotalPosterior;
      normalizedProbabilities[hypoKey][2] = newHypoProbabilities[hypoKey][2];
    }

    console.log(newHypoProbabilities.GASTRITIS, newHypoProbabilities.FUNCTIONAL_DYSPEPSIA);
    setHypoProbabilities(normalizedProbabilities);
    setEvidenceNumber(evidenceNumber => evidenceNumber + 1);
    setAnswers(answers => [...answers, userLevel]);
  };

  useEffect(() => {
    if (evidenceNumber == allEvidencesKeys.length) {
      setMode(MODES.RESULT);
      let maximum = 0;
      let result = '';
      for (const hypoKey of allHypoKeys) {
        if (hypoProbabilities[hypoKey][1] > maximum) {
          maximum = hypoProbabilities[hypoKey][1];
          setResult(hypoProbabilities[hypoKey]);
        }
      }
      console.log(answers);
    }
  }, [evidenceNumber]);

  return (
    <>
      {/* {console.log(hypoProbabilities)} */}
      {mode == MODES.ENTRY ? (
        <div>
          <h2>Система диагностики заболеваний желудка</h2>
          <button onClick={() => setMode(MODES.SURVEY)}>Начать опрос</button>
        </div>
      ) : (
        <div></div>
      )}
      {mode == MODES.RESULT ? (
        <div style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={result[2]}
            alt={result[1]}
            style={{ display: 'flex', width: '312px', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}
          />
          <h2>Вероятнее всего, ответивший имеет {result[0]}</h2>
          <button
            onClick={() => {
              setEvidenceNumber(0);
              setMode(MODES.ENTRY);
              setHypoProbabilities(HYPOTHESES);
              setResult();
              setAnswers([]);
            }}
          >
            Начать снова
          </button>
          {/* {allHypoKeys.map((hypoKey, index) => (
            <div key={index}>
              <h3>{hypoProbabilities[hypoKey][0]}</h3>
              <h3>{hypoProbabilities[hypoKey][1]}</h3>
            </div>
          ))} */}
        </div>
      ) : (
        <div></div>
      )}
      {mode == MODES.SURVEY && evidenceNumber < allEvidencesKeys.length ? (
        <>
          <h2>Выберите степень симптома</h2>
          <h3>по шкале от -2 до +2, где -2 - совсем не чувствую, +2 - определенно чувствую</h3>
          <h1>{EVIDENCES[allEvidencesKeys[evidenceNumber]][0]}</h1>
          <div>
            {button_texts.map((button_text, index) => (
              <button
                key={index}
                onClick={() => {
                  // allHypoKeys.forEach(hypoKey => console.log(hypoKey, EVIDENCES[allEvidencesKeys[evidenceNumber]]));
                  // console.log(EVIDENCES[allEvidencesKeys[evidenceNumber]]);
                  handleAnswer(button_text);
                }}
              >
                {button_text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};
