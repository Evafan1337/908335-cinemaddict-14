import EmptyFilmsView from '../view/empty-films';
import {render, RenderPosition} from '../utils';

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
    this._emptyFilms = null;
  }

  /**
   * Метод инициализации
   */
  init() {
    this._emptyFilms = new EmptyFilms();
    this._renderEmpty();
  }

  /**
   * Метод рендера
   */
  _renderEmpty() {
    render(this._emptyContainer, this._emptyFilms);
  }
}
