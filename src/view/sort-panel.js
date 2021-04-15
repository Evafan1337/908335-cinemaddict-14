import {createElement} from "../utils";

/**
 * Функция создания компонента сортировки
 * @return {string}
 */
const createSortPanelTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort="rating">Sort by rating</a></li>
  </ul>`;
};

/**
 * Класс описывает панель сортировки
 */
export default class SortPanel {

  /**
   * Конструктор
   */
  constructor() {
    this._element = null;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createSortPanelTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createSortPanelTemplate();
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
