import AbstractView from './abstract.js';

const createFilmListTemplate = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container js-film-list-commented">
      </div>
    </section>`;
};

/**
 * Класс описывает компонент (контейнер для фильмов в топе по кол-ву комментариев)
 * @extends AbstractView
 */
export default class FilmsListCommented extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
