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
 * @extends AbstractView
 */
export default class Loadmore extends AbstractView {

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createLoadmoreTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createLoadmoreTemplate();
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
