import EmptyFilms from '../view/empty-films';
import {render, RenderPosition} from '../utils';

export default class EmptyPresenter {
  constructor(emptyContainer) {
    this._emptyContainer = emptyContainer;
    this._emptyFilms = null;
  }

  /**
   * Метод инициализации
   */
  init() {
    this._emptyFilms = new EmptyFilms();
    this._renderEmpty();
  }

  _renderEmpty() {
    render(this._emptyContainer, this._emptyFilms.getElement(), RenderPosition.BEFOREEND);
  }
}
