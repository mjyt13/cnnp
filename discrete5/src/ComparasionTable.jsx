import { useEffect, useState } from 'react';
import { ITEMS, W_MAX, T_MIN, T_START, L_K, ALPHA } from '../src/knapsack_constants';
import { bruteForceSolve } from './bruteforce_solution';
import { simulatedAnnealing } from './simulated_annealing';
// Исходные Данные
const CONSTANTS = {
  W_MAX: W_MAX, // Ограничение по весу ранца
  T_START: T_START,
  ALPHA: ALPHA,
  T_MIN: T_MIN,
  L_K: L_K, // Сокращенное число итераций
  ITEMS: ITEMS,
};

// ====================================================================
// Импорт Функций (Остается как есть в вашем файле)
// ====================================================================
// import { simulatedAnnealing } from './simulated_annealing.js';
// import { bruteForceSolve } from './bruteforce_solution.js';

// ====================================================================

// ====================================================================

// ====================================================================
// Компонент React
// ====================================================================

export default function ComparisonTable() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const bfResult = bruteForceSolve();
    const saResult = simulatedAnnealing();
    setResults([bfResult, saResult]);
  }, []);

  const solutionToItems = solution => {
    return solution.map((val, index) => (val === 1 ? CONSTANTS.ITEMS[index].id : null)).filter(id => id !== null);
  };

  const optimalP = results.length > 0 ? results[0].p : null;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📊 Сравнение Методов Оптимизации для Задачи о Ранце</h2>

      <hr />

      <h3>📋 Исходные Данные и Параметры</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {/* Таблица Предметов */}
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '480px' }}>
          <h4>Предметы (M={CONSTANTS.ITEMS.length})</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Вес (w)</th>
                <th style={thStyle}>Ценность (p)</th>
              </tr>
            </thead>
            <tbody>
              {CONSTANTS.ITEMS.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{item.id}</td>
                  <td style={tdStyle}>{item.w}</td>
                  <td style={tdStyle}>{item.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '10px' }}>
            <strong>Вместимость ранца (W):</strong> <strong>{CONSTANTS.W_MAX}</strong>
          </p>
        </div>

        {/* Параметры SA - ИСПРАВЛЕНО ИСПОЛЬЗОВАНИЕ LaTeX */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h4>Параметры Имитации Отжига (SA)</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {/* Использование <sub> для T_START */}
            <li>
              Начальная температура (T<sub>START</sub>): <strong>{CONSTANTS.T_START}</strong>
            </li>
            {/* Использование &alpha; для альфа */}
            <li>
              Коэффициент охлаждения (&alpha;): <strong>{CONSTANTS.ALPHA}</strong>
            </li>
            <li>
              Минимальная температура (T<sub>MIN</sub>): <strong>{CONSTANTS.T_MIN}</strong>
            </li>
            {/* Использование <sub> для L_K */}
            <li>
              Итераций на T (L<sub>K</sub>): <strong>{CONSTANTS.L_K}</strong> (Сокращено)
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <h3>⚖️ Сравнительная Таблица Результатов</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #333' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyleMain}>Метод</th>
            <th style={thStyleMain}>Ценность (P)</th>
            <th style={thStyleMain}>Вес (W)</th>
            <th style={thStyleMain}>Выбранные Предметы (ID)</th>
            <th style={thStyleMain}>Тип Оптимума</th>
            <th style={thStyleMain}>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyleMain}>
                <strong>{result.method}</strong>
                {result.method === 'Имитация Отжига (SA)' && result.finalTemp !== undefined && (
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    (T<sub>final</sub>: {result.finalTemp.toFixed(2)})
                  </div>
                )}
                {result.method === 'Полный Перебор (BF)' && result.totalCombinations !== undefined && (
                  <div style={{ fontSize: '0.8em', color: '#666' }}>(Проверено: {result.totalCombinations} комб.)</div>
                )}
              </td>
              <td
                style={{
                  ...tdStyleMain,
                  fontWeight: 'bold',
                  color: index === 0 ? 'green' : result.p === optimalP ? 'green' : 'orange',
                }}
              >
                {result.p}
              </td>
              <td style={tdStyleMain}>{result.w}</td>
              <td style={tdStyleMain}>{solutionToItems(result.solution).join(', ')}</td>
              <td style={tdStyleMain}>{result.isOptimal ? 'Глобальный' : 'Эвристический'}</td>
              <td style={tdStyleMain}>{result.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Финальный комментарий - ИСПРАВЛЕНО */}
      {results.length === 2 && (
        <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
          *В данном примере, Имитация Отжига (P={results[1].p}) достигла результата,
          {results[1].p === results[0].p ? ' идентичного' : ' близкого к'} глобальному оптимуму (P={results[0].p}). Это
          демонстрирует высокую эффективность SA даже при сокращенном числе итераций (L<sub>K</sub>={CONSTANTS.L_K}) для небольших
          задач.
        </p>
      )}
    </div>
  );
}

// Стили для таблицы
const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
};
const tdStyle = {
  border: '1px solid #eee',
  padding: '8px',
  textAlign: 'center',
};
const thStyleMain = {
  ...thStyle,
  backgroundColor: '#e6f7ff',
};
const tdStyleMain = {
  ...tdStyle,
  border: '1px solid #ccc',
};
