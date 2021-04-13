import dayjs from 'dayjs';

/**
 * Функция создания компонента (карточка фильма)
 * @param {object} film - объект (фильм)
 * @return {string}
 */
export const createCardFilmTemplate = (film) => {

  const {id, info, time, date, rating, isFavorite, isViewed, isWatchlist, genre, comments, description} = film;

  const year = dayjs(date).format('YYYY');

  // Тернарные операторы и вывод класса "активности" при необходимости
  const watchlistClassName = isWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = isViewed
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--active'
    : '';

  /**
   * Функция сокращения описания фильма для отображения в карточке фильма
   * @return {string} slicedDescription - сокращенное описание фильма
   */
  const sliceDescription = () => {
    let slicedDescription;
    if (description.length > 140) {
      slicedDescription = description.slice(0, 139) + '...';
    } else {
      slicedDescription = description;
    }
    return slicedDescription;
  };

  return `<article class="film-card" id="${id}">
          <h3 class="film-card__title js-open-popup">${info.title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${time}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img class="film-card__poster js-open-popup" src="./images/posters/${info.poster}" alt="">
          <p class="film-card__description">${sliceDescription()}</p>
          <a class="film-card__comments js-open-popup">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button"></button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button"></button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button"></button>
          </div>
        </article>`;
};
