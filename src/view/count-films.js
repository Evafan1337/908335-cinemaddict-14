import {createElement} from '../utils';

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
export default class FooterStatistics {

  /**
   * Конструктор
   * @param {number} count - количество подсчитанных фильмов (счетчик)
   */
  constructor(count) {
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

  /**
   * Метод получения поля this._element
   * Если это поле не существует то вызывается утилитарная функция createElement
   * Аргументом которой является рез-т метода this.getTemplate()
   * @return {Object} this._element - созданный DOM элемент с заполненной информацией из карточки фильма
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Метод удаления элемента
   */
  removeElement() {
    this._element = null;
  }
}
