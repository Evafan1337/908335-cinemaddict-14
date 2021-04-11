/**
 * Функция создания счетчика фильмов
 * @param {number} count - счетчик фильмов
 * @return {string}
 */
export const createFooterStatisticsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};
