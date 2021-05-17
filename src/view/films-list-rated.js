import AbstractView from './abstract.js';

const createFilmListTemplate = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container js-film-list-rated">
      </div>
    </section>`;
};

/**
 * Класс описывает компонент (контейнер для фильмов в топе по рейтингу)
 * @extends AbstractView
 */
export default class FilmsListRated extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
