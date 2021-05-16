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
    console.log('init FilterPresenter');
    this._renderMenu();
    this._renderSort();
  }

  observeFilter() {
    //  По сути пересчитываем значение кол-ва фильмов в фильтрах
    const filmsInfoSortLength = getFilmsInfoSortLength(filmsInfoSort(this._filmsModel.getFilms()));
    this._filterModel.setSort(filmsInfoSortLength);
    this.init();
  }

  /**
   * Приватный метод рендера меню (фильтации)
   */
  _renderMenu() {
    console.log('filter.js : _renderMenu');
    const prevMenu = this._menuComponent;

    console.log(this._filterModel.getSort());

    this._menuComponent = new MenuView(this._filterModel.getSort(), this._filterModel.getFilterType());

    // console.log(this._menuComponent);
    let copy = Object.assign({}, this._menuComponent);
    console.log(copy);

    if (prevMenu) {
      replace(this._menuComponent, prevMenu);
    } else {
      render(this._filterContainer, this._menuComponent, RenderPosition.BEFOREEND);
    }
    this._menuComponent.setClickHandler(this._handleFilterItemClick);
    this._menuComponent.setClickStatsHandler(this._handleStatsItemClick);
  }

  _handleFilterItemClick(evt) {
    this._showSort();
    //  dataset
    this._filterModel.setSortType(this._filterModel.getSortType(), evt.target.getAttribute('data-sort'), false);
    this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
  }

  _renderSort() {
    const sortPanelComponent = this._sortPanelComponent;
    this._sortPanelComponent = new SortPanelView(this._filterModel.getSortType());
    if (sortPanelComponent) {
      replace(this._sortPanelComponent, sortPanelComponent);
    } else {
      render(this._filterContainer, this._sortPanelComponent);
    }
    // this._sortPanelComponent.setClickHandler((evt) => this._handleSortItemClick(evt));
    this._sortPanelComponent.setClickHandler(this._handleSortItemClick);
  }

  _handleSortItemClick(evt) {
    //  dataset?
    this._filterModel.setSortType(evt.target.getAttribute('data-sort'), this._filterModel.getFilterType(), false);
    this._sortPanelComponent.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    //this.update();
  }

  _handleStatsItemClick(evt) {
    this._filterModel.setSortType(this._filterModel.getSortType(), this._filterModel.getFilterType(), true);
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this._hideSort();
  }

  _hideSort() {
    this._sortPanelComponent.hide();
  }

  _showSort() {
    this._sortPanelComponent.show();
  }
}