/**
 * Функция получения случайного числа в промежутке
 * @param {number} a - начало промежутка
 * @param {number} b - конец промежутка
 * @return {number}
 */
export const getRandomInteger = (a = 0, b = 1) => {
  //  ceil - округление вверх
  const lower = Math.ceil(Math.min(a, b));
  //  floor - округление вниз
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
