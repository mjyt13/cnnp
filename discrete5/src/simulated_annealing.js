import { ITEMS, W_MAX, T_START, ALPHA, T_MIN, L_K } from './knapsack_constants.js';

// ====================================================================
// Вспомогательные Функции
// ====================================================================

/**
 * 1. Оценка решения: вычисляет общую ценность и вес текущего набора.
 * @param {number[]} solution - Бинарный вектор (0 или 1) для каждого предмета.
 * @returns {{p: number, w: number, isFeasible: boolean}}
 */
function evaluateSolution(solution) {
  let totalP = 0; // Общая ценность (price)
  let totalW = 0; // Общий вес (weight)

  for (let i = 0; i < ITEMS.length; i++) {
    if (solution[i] === 1) {
      totalP += ITEMS[i].p;
      totalW += ITEMS[i].w;
    }
  }

  return {
    p: totalP,
    w: totalW,
    isFeasible: totalW <= W_MAX, // Использование W_MAX
  };
}

/**
 * 2. Генерация начального решения (простой вариант: пустой ранец).
 * @returns {number[]}
 */
function initializeSolution() {
  // Вектор из 7 нулей (все предметы исключены)
  return new Array(ITEMS.length).fill(0);
}

/**
 * 3. Генерация соседнего решения (Оператор Окрестности N(x))
 * Случайно инвертирует один бит (включает или исключает предмет).
 * @param {number[]} currentSolution - Текущий бинарный вектор решения.
 * @returns {number[]} - Новое бинарное решение.
 */
function generateNeighbor(currentSolution) {
  const newSolution = [...currentSolution];

  // Выбираем случайный предмет для изменения (равномерное распределение)
  const randomIndex = Math.floor(Math.random() * ITEMS.length);

  // Инвертируем состояние выбранного предмета
  // (0 -> 1, или 1 -> 0)
  newSolution[randomIndex] = 1 - newSolution[randomIndex];

  return newSolution;
}

// ====================================================================
// Основной Алгоритм Имитации Отжига (SA)
// ====================================================================

/**
 * Реализация алгоритма Имитации Отжига для задачи о ранце.
 */
export function simulatedAnnealing() {
  // 1. Инициализация

  let currentSolution = initializeSolution();
  let currentState = evaluateSolution(currentSolution);

  // Лучшее найденное решение
  let bestSolution = [...currentSolution];
  let bestState = currentState;

  let currentTemp = T_START;
  let tempIteration = 0;
  let allIterations = 0;

  // Внешний цикл: Уменьшение температуры
  while (currentTemp > T_MIN) {
    // Внутренний цикл: Итерации при текущей температуре (L_k)
    let innerIters = 0;
    for (let i = 0; i < L_K; i++) {
      // 4. Генерация Соседа
      const neighborSolution = generateNeighbor(currentSolution);
      const neighborState = evaluateSolution(neighborSolution);
      allIterations++;

      // Обработка недопустимого решения: если вес превышен,
      // мы приравниваем его ценность к очень маленькому числу (штраф),
      // чтобы почти гарантированно не принять его, но дать небольшой шанс.
      // В более строгих реализациях недопустимые соседи просто отбрасываются.
      if (!neighborState.isFeasible) {
        neighborState.p = 0; // Использование p
      }

      // 5. Расчет Дельты Энергии (Delta E)
      // Задача на МАКСИМИЗАЦИЮ, поэтому: Delta E = E(новое) - E(текущее)
      const deltaE = neighborState.p - currentState.p; // Использование p

      // 6. Правило Принятия
      let accept = false;
      const prob = Math.exp(deltaE / currentTemp);

      if (deltaE > 0 || (Math.random() < prob && prob > 0.65)) {
        // Всегда принимаем лучшее решение
        accept = true;
      } else console.log(prob, innerIters);

      // 7. Обновление
      if (accept) {
        currentSolution = neighborSolution;
        currentState = neighborState;

        // Обновляем глобально лучшее решение
        if (currentState.p > bestState.p && currentState.isFeasible) {
          bestSolution = currentSolution;
          bestState = currentState;
          break;
        }
      }
      innerIters++;
    }

    // 8. Охлаждение
    currentTemp *= ALPHA;
    tempIteration++;
  }

  return {
    method: 'Имитация Отжига (SA)',
    p: bestState.p,
    w: bestState.w,
    solution: bestSolution,
    // Дополнительные параметры специфичные для SA
    finalTemp: currentTemp,
    tempCycles: tempIteration,
    isOptimal: false, // Эвристический метод
    note: `Сходимость после ${tempIteration} циклов температуры. Общее число итераций: ${allIterations}`,
    iterations: allIterations,
  };
}
