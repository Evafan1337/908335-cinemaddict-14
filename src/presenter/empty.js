import EmptyFilmsView from '../view/empty-films';
import SiteMenuView from '../view/menu.js';
import {render} from '../utils/render';

/**
 * Класс описывает презентер пустого списка фильмов
 */
export default class EmptyPresenter {

  /**
   * Конструктор презентера
   * @param {emptyContainer} - ссылка на HTML элемент куда надо отрисовать пустой список фильмов
   */
  constructor(emptyContainer) {
    this._emptyContainer = emptyContainer;
    this._emptyFilmsComponent = new EmptyFilmsView();
    this._menu = null;

    // check later
    this._sort = {
      watchlist: 0,
      history: 0,
      favorites: 0,
    };
  }

  /**
   * Метод инициализации
   */
  init() {
    this._menuComponent = new SiteMenuView(this._sort);
    this._renderEmpty();
  }

  /**
   * Метод рендера
   */
  _renderEmpty() {
    render(this._emptyContainer, this._menuComponent);
    render(this._emptyContainer, this._emptyFilmsComponent);
  }
}
