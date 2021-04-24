import AbstractView from './abstract';

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
export default class SortPanel extends AbstractView {

  constructor() {
    super();
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortPanelTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (const btn of this.getElement().querySelectorAll('.sort__button')) {
      btn.addEventListener('click', this._clickHandler);
    }
  }
}
