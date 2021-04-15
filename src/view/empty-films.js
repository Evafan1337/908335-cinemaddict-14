import {createElement} from "../utils";

/**
 * Функция создания компонента при отсутствии фильмов
 * @return {string}
 */
export const createEmptyFilms = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class EmptyFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyFilmsTemplate();
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