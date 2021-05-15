import AbstractView from './abstract';
import SmartView from "./smart";

/**
 * Функция создания компонента сортировки
 * @return {string}
 */
const createSortPanelTemplate = (sortBy) => {

  const defaultClassName = (sortBy === 'default')
  ? 'sort__button--active'
  : '';

const dateClassName = (sortBy === 'date')
  ? 'sort__button--active'
  : '';

const ratingClassName = (sortBy === 'rating')
  ? 'sort__button--active'
  : '';

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${defaultClassName}" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button ${dateClassName}" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button ${ratingClassName}" data-sort="rating">Sort by rating</a></li>
  </ul>`;
};

/**
 * Класс описывает панель сортировки
 */
export default class SortPanel extends SmartView {

  /**
   * Конструктор
   * Вызывается конструктор класса родителя (AbstractView)
   * Производится привязка контекста обработчика к объекту компонента
   */
  constructor(sortBy) {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this._sortBy = sortBy;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createSortPanelTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createSortPanelTemplate(this._sortBy);  }

  /**
   * Метод получения HTML тега выбранной сортировки
   * @return {object} - HTML элемент
   */
  getActiveMenuLink() {
    return this.getElement().querySelector('.sort__button--active');
  }

  /**
   * Метод отработки слушателя
   * @param {Object} evt - объект событий
   */
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  /**
   * Метод установки слушателя
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setClickHandler(callback) {
    this._callback.click = callback;
    for (const btn of this.getElement().querySelectorAll('.sort__button')) {
      btn.addEventListener('click', this._clickHandler);
    }
  }
}
