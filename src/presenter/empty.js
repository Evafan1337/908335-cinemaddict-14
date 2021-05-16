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

    this._filterFilmsCount = {
      isWatchlist: 0,
      isViewed: 0,
      isFavorite: 0,
    };
  }

  /**
   * Метод инициализации
   */
  init() {
    this._menuComponent = new SiteMenuView(this._filterFilmsCount);
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
