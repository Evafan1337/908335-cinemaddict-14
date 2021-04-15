import {createElement} from "../utils";

/**
 * Функция создания компонента списка фильмов
 * @return {string}
 */
const createFilmListTemplate = () => {
  return `<section class="films">
    <section class="films-list js-films-container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container js-film-list-main">
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container js-film-list-rated">
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container js-film-list-commented">
      </div>
    </section>
  </section>`;
};

export default class FilmList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate();
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