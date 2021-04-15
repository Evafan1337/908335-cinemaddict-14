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

export default class SortPanel {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortPanelTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
