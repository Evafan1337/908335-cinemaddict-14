import MenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import {
  replace,
  remove}
  from '../utils/dom';

import {
  render}
  from '../utils/render';

import {
  RenderPosition}
  from '../utils/const';

import {
  getFilmsInfoSortLength,
  filmsInfoSort}
  from '../utils/sort';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilter.bind(this));
    this._menuComponent = null;
    this._sortPanelComponent = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleStatsItemClick = this._handleStatsItemClick.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderSort();
  }

  observeFilter() {
    //  По сути пересчитываем значение кол-ва фильмов в фильтрах
    const filmsInfoSortLength = getFilmsInfoSortLength(filmsInfoSort(this._filmsModel.getFilms()));
    this._filterModel.setFilterFilmsCount(filmsInfoSortLength);
    this.init();
  }

  /**
   * Приватный метод рендера меню (фильтации)
   */
  _renderMenu() {
    const prevMenu = this._menuComponent;
    this._menuComponent = new MenuView(this._filterModel.getFilterFilmsCount(), this._filterModel.getFilterBy());

    if (prevMenu) {
      replace(this._menuComponent, prevMenu);
    } else {
      render(this._filterContainer, this._menuComponent);
    }
    this._menuComponent.setClickHandler(this._handleFilterItemClick);
    this._menuComponent.setClickStatsHandler(this._handleStatsItemClick);
  }

  /**
   * Обработчик клика по кнопкам фильтрации
   * @param {Object} evt - объект события
   */
  _handleFilterItemClick(evt) {

    if(evt.target.tagName !== 'A') {
      return;
    }

    this._showSort();
    this._filterModel.setSortType(this._filterModel.getSortBy(), evt.target.dataset.filter, false);
    this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
  }

  /**
   * Приватный метод рендера компонента сортировки
   */
  _renderSort() {
    const sortPanelComponent = this._sortPanelComponent;
    this._sortPanelComponent = new SortPanelView(this._filterModel.getSortBy());
    if (sortPanelComponent) {
      replace(this._sortPanelComponent, sortPanelComponent);
    } else {
      render(this._filterContainer, this._sortPanelComponent);
    }
    this._sortPanelComponent.setClickHandler(this._handleSortItemClick);
  }

  /**
   * Обработчик клика по кнопкам сортировки
   * @param {Object} evt - объект события
   */
  _handleSortItemClick(evt) {
    this._filterModel.setSortType(evt.target.dataset.sort, this._filterModel.getFilterBy(), false);
    this._sortPanelComponent.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
  }

  _handleStatsItemClick(evt) {
    console.log('_handleStatsItemClick');
    this._filterModel.setSortType(this._filterModel.getSortBy(), this._filterModel.getFilterBy(), true);
    this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this._hideSort();
  }

  _hideSort() {
    this._sortPanelComponent.hide();
  }

  _showSort() {
    this._sortPanelComponent.show();
  }
}