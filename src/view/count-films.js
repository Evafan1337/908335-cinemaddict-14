import SmartView from './smart';

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
 */
export default class FooterStatistics extends SmartView {

  /**
   * Конструктор
   * @param {number} count - количество подсчитанных фильмов (счетчик)
   */
  constructor(count) {
    super();
    this._element = null;
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
