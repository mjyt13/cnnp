// src/constants.js

// --- КАТЕГОРИИ ВОПРОСОВ (Для mode и структурирования) ---
export const MODES = {
  READY: 'ready',
  COLOR: 'color',
  SIZE: 'size',
  EFFECT: 'effect',
  RESULT: 'result',
};

// --- ФАКТЫ / ЗНАЧЕНИЯ (Для сравнения в approved/disapproved) ---

export const COLORS = {
  BLUE: 'Синяя',
  RED: 'Красная',
  GREEN: 'Зеленая',
  YELLOW: 'Желтая',
  PURPLE: 'Фиолетовая',
  WHITE: 'Белая',
  BLACK: 'Черная',
  ORANGE: 'Оранжевая',
};

export const SIZES = {
  LARGE: 'Большая (4-6 см в длину и ширину)',
  MEDIUM: 'Средняя (1.5-3 см в длину и ширину)',
  SMALL: 'Маленькая (0.3-1.5 см в длину и ширину)',
};

export const EFFECTS = {
  GLITTER: 'Блёстки',
  METALLIC: 'Металлическая\n(Можно увидеть отражающиеся объекты)',
  HOLOGRAPHIC: 'Голографическая\n(Изменяются цвета при движении,\nэлементы остаются на месте)',
  LENTICULAR: 'Лентикулярная\n(Изменяется структура наклейки)',
};

// --- КОМБИНИРОВАННЫЕ СПИСКИ (Для итерации по вопросам) ---
// Эти массивы удобно использовать в JSX для итерации по вопросам.
export const COLOR_NAMES_ARRAY = Object.values(COLORS);
export const SIZE_NAMES_ARRAY = Object.values(SIZES);
export const EFFECT_NAMES_ARRAY = Object.values(EFFECTS);
