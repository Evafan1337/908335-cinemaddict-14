import {createElement} from "../utils";

/**
 * Функция создания кнопки отрисовки дополнительных фильмов
 * @return {string}
 */
const createLoadmoreTemplate = () => {
  return '<button class="films-list__show-more js-loadmore">Show more</button>';
};

export default class Loadmore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadmoreTemplate();
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