import AbstractView from './abstract';
import SmartView from './smart';

/**
 * Функция создания компонента меню
 * @param {object} filmsInfo - информация о фильме
 * @return {string}
 */
const createMenuTemplate = (filmsInfo) => {

  const {isWatchlist, isViewed, isFavorite} = filmsInfo;

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${isWatchlist}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item">History <span class="main-navigation__item-count">${isViewed}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${isFavorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

/**
 * Класс описывает компонент меню
 */
export default class Menu extends SmartView {

  /**
   * Конструктор
   * @param {Object} filmsInfo - данные о фильмах
   */
  constructor(filmsInfo) {
    super();
    this._element = null;
    this._filmsInfo = filmsInfo;
    this._clickHandler = this._clickHandler.bind(this);
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createMenuTemplate с аргументом this._filmsInfo
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createMenuTemplate(this._filmsInfo);
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
}
