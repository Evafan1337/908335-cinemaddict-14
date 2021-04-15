import dayjs from 'dayjs';
import {createCommentsTemplate} from './comments';
import {createElement} from "../utils";

/**
 * Функция создания элемента(элементов) жанров фильма
 * @param {array} genre - массив жанров фильмов
 * @return {string} - HTML отображение жанров
 */
const createGenresTemplate = (genre) => {
  return genre.map((item) => `<span class="film-details__genre">${item}</span>`).join('');
};

/**
 * Функция создания шаблона полной карточки фильма(попап)
 * @param {Object} film - данные о фильме
 * @return {string} - HTML отображение попапа
 */
const createTemplatePopupFilm = (film) => {

  const {info, time, date, rating, isFavorite, isViewed, isWatchlist, comments, description, regisseur, screenwriters, actors, country, genre} = film;
  const fullDate = dayjs(date).format('DD MMMM YYYY');

  const watchlistCheck = isWatchlist
    ? 'checked'
    : '';

  const watchedCheck = isViewed
    ? 'checked'
    : '';

  const favoriteCheck = isFavorite
    ? 'checked'
    : '';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${info.poster}" alt="">
          <p class="film-details__age">18+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${info.title}</h3>
              <p class="film-details__title-original">Original: ${info.originTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${regisseur}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriters.map((item) => item).join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.map((item) => item).join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${fullDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${time}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${createGenresTemplate(genre)}
            </tr>
          </table>
          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistCheck}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedCheck}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteCheck}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        ${createCommentsTemplate(comments)}
      </section>
    </div>
  </form>
</section>`;
};

/**
 * Класс описывает компонент панели сортировки
 */
export default class Popup {

  /**
   * Конструктор
   * @param {Object} film - фильм
   */
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createTemplatePopupFilm с аргументом this._film
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createTemplatePopupFilm(this._film);
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