import AbstractView from './abstract';

/**
 * Функция создания счетчика фильмов
 * @param {number} count - счетчик фильмов
 * @return {string}
 */
const createFooterStatisticsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

/**
 * Класс описывает компонент (счетчик фильмов)
 * @extends AbstractView
 */
export default class FooterStatistics extends AbstractView {

  /**
   * @constructor
   * @param {number} count - количество подсчитанных фильмов (счетчик)
   */
  constructor(count) {
    super();
    this._filmCount = count;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createFooterStatisticsTemplate с аргументом this._filmCount
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createFooterStatisticsTemplate(this._filmCount);
  }
}
