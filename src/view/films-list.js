/**
 * Функция создания компонента списка фильмов
 * @return {string}
 */
export const createFilmListTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container js-film-list-main">
      </div>
      <button class="films-list__show-more">Show more</button>
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
