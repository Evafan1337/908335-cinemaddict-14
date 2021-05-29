/**
 * Функция обновления элемента массива
 * @param {Array} items - массив данных
 * @return {Object} update - элемент для замены
 */
export const updateItem = (items, update) => {

  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

/**
 * Функция получения случайного числа в промежутке
 * @param {number} a - начало промежутка
 * @param {number} b - конец промежутка
 * @return {number}
 */
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
