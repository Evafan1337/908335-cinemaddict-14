import AbstractView from './abstract';

/**
 * Функция создания кнопки отрисовки дополнительных фильмов
 * @return {string}
 */
const createLoadmoreTemplate = () => {
  return '<button class="films-list__show-more js-loadmore">Show more</button>';
};

/**
 * Класс описывает компонент (кнопку подгрузки фильмов)
 */
export default class Loadmore extends AbstractView {

  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createLoadmoreTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createLoadmoreTemplate();
  }

  /**
   * Метод отработки слушателя
   * @param {Object} evt - объект событий
   */
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  /**
   * Метод установки слушателя
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
