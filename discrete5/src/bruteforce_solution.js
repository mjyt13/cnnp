// bruteforce_solution.js
import { ITEMS, W_MAX } from './knapsack_constants.js';

/**
 * Функция, вычисляющая ценность и вес решения.
 * @param {number[]} solution - Бинарный вектор решения.
 * @returns {{p: number, w: number}}
 */
function calculateState(solution) {
  let totalP = 0;
  let totalW = 0;

  for (let i = 0; i < ITEMS.length; i++) {
    if (solution[i] === 1) {
      totalP += ITEMS[i].p;
      totalW += ITEMS[i].w;
    }
  }

  return { p: totalP, w: totalW };
}

/**
 * Функция полного перебора для поиска идеального решения.
 */
export function bruteForceSolve() {
  const M = ITEMS.length;
  let bestP = 0;
  let bestW = 0;
  let bestSolution = new Array(M).fill(0);

  // Перебор всех 2^M возможных комбинаций (от 0 до 2^M - 1)
  const numCombinations = Math.pow(2, M);

  console.log(`\n--- Полный Перебор (Brute Force) ---`);
  console.log(`Общее число комбинаций для M=${M}: ${numCombinations}`);

  for (let i = 0; i < numCombinations; i++) {
    // Конвертируем число i в бинарный вектор решения (например, 10 -> [0,0,1,0,1,0,0])
    const currentSolution = new Array(M).fill(0);
    let temp = i;
    // console.log(i, i.toString(2));

    for (let j = 0; j < M; j++) {
      if (temp & 1) {
        // Если последний бит равен 1
        currentSolution[M - 1 - j] = 1;
      }
      temp >>= 1; // Сдвиг битов вправо
    }

    const currentState = calculateState(currentSolution);

    // Проверка допустимости и сравнение с лучшим результатом
    if (currentState.w <= W_MAX) {
      if (currentState.p > bestP) {
        bestP = currentState.p;
        bestW = currentState.w;
        bestSolution = currentSolution;
      }
    }
  }

  return {
    method: 'Полный Перебор (BF)',
    p: bestP,
    w: bestW,
    solution: bestSolution,
    // Дополнительные параметры специфичные для BF
    totalCombinations: numCombinations,
    isOptimal: true, // Гарантированный глобальный оптимум
    note: `Перебрано ${numCombinations} комбинаций.`,
  };
}
