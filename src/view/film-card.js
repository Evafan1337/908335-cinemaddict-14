import dayjs from 'dayjs';
import AbstractView from './abstract';

/**
 * Функция создания компонента (карточка фильма)
 * @param {object} film - объект (фильм)
 * @return {string}
 */
const createFilmCardTemplate = (film) => {

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

  return `<article class="film-card" id="${id}"  data-id="${id}">
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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button"  data-type="isWatchlist"></button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" data-type="isViewed"></button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button" data-type="isFavorite"></button>
          </div>
        </article>`;
};


/**
 * Класс описывает компонент (карточка фильма)
 */
export default class FilmCard  extends AbstractView {

  /**
   * Конструктор
   * @param {Object} film - данные о фильме
   */
  constructor(film) {
    super();
    this._element = null;
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._data = FilmCard.parseFilmToData(film);
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createFilmCardTemplate с аргументом this._film
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  reset(film) {
    this.updateData(FilmCard.parseFilmToData(film));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
  }

  _setInnerHandlers() {
    for (let btn of this.getElement().querySelectorAll(`.js-open-popup`)) {
      btn.addEventListener(`click`, this._clickHandler);
    }
  }

  /**
   * Метод отработки слушателя
   * @param {Object} evt - объект событий
   */
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  /**
   * Метод установки слушателя
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setClickHandler(callback) {
    this._callback.click = callback;
    for (const btn of this.getElement().querySelectorAll('.js-open-popup')) {
      btn.addEventListener('click', this._clickHandler);
    }
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    let type = evt.target.getAttribute(`data-type`);
    this._callback.editClick(evt, FilmCard.parseDataToFilm(this._data));
    this.updateData({
      [type]: [type]
    });
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    for (let control of this.getElement().querySelectorAll('.film-card__controls-item')) {
      control.addEventListener(`click`, this._editClickHandler);
    }
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      isFavorite: film.isFavorite,
      isViewed: film.isViewed,
      isWatchlist: film.isWatchlist,
    });
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isFavorite;
    delete data.isWatchlist;
    delete data.isViewed;

    return data;
  }
}
