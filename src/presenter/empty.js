import EmptyFilmsView from '../view/empty-films';
import {render, RenderPosition} from '../utils/render';
import {remove} from '../utils/dom';


/**
 * Класс описывает презентер пустого списка фильмов
 */
export default class EmptyPresenter {

  /**
   * @param {emptyContainer} - ссылка на HTML элемент куда надо отрисовать пустой список фильмов
   * @constructor
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
    this._renderEmpty();
  }

  /**
   * Метод рендера
   */
  _renderEmpty() {
    if(this._emptyContainer.querySelector('.films-list films-list--extra')) {
      render(this._emptyContainer, this._emptyFilmsComponent, RenderPosition.AFTERBEGIN);
    } else {
      render(this._emptyContainer, this._emptyFilmsComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._emptyFilmsComponent);
  }
}
