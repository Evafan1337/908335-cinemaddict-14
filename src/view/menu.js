import AbstractView from './abstract';

/**
 * Функция создания компонента меню
 * @param {object} filmsInfo - информация о фильме
 * @return {string}
 */
const createMenuTemplate = (filmsInfo, sortType) => {

  const {isWatchlist, isViewed, isFavorite} = filmsInfo;
  console.log(filmsInfo);

  const allFilmsClassName = (sortType === 'all')
    ? 'main-navigation__item--active'
    : '';

  const watchlistClassName = (sortType === 'isWatchlist')
    ? 'main-navigation__item--active'
    : '';

  const watchedClassName = (sortType === 'isViewed')
    ? 'main-navigation__item--active'
    : '';

  const favoriteClassName = (sortType === 'isFavorite')
    ? 'main-navigation__item--active'
    : '';


  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item ${allFilmsClassName}">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item ${watchlistClassName}">Watchlist <span class="main-navigation__item-count">${isWatchlist}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item ${watchedClassName}">History <span class="main-navigation__item-count">${isViewed}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item ${favoriteClassName}">Favorites <span class="main-navigation__item-count">${isFavorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

/**
 * Класс описывает компонент меню
 */
export default class Menu extends AbstractView {

  /**
   * Конструктор
   * @param {Object} filmsInfo - данные о фильмах
   */
  constructor(sortInfo, sortType) {
    super();
    this._sortInfo = sortInfo;
    this._sortType = sortType;
    this._clickStatsHandler = this._clickStatsHandler.bind(this);
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createMenuTemplate с аргументом this._filmsInfo
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    console.log(this._sortType);
    return createMenuTemplate(this._sortInfo, this._sortType);
  }

  /**
   * Метод получения активного элемента фильтрации
   */
  getActiveMenuLink() {
    return this.getElement().querySelector('.main-navigation__item--active');
  }

  /**
   * Метод установки слушателя
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setClickHandler(callback) {
    this._callback.click = callback;
    for (const btn of this.getElement().querySelectorAll('.main-navigation__item')) {
      btn.addEventListener('click', this._clickHandler);
    }
  }


  _clickStatsHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick(evt);
  }

  setClickStatsHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._clickStatsHandler);
  }
}
