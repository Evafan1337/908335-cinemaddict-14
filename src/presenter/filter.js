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

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    console.log(this._filmsModel);

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
    this.init();

    //  check later

    const filmsInfoSortLength = getFilmsInfoSortLength(filmsInfoSort(films));
    console.log(filmsInfoSortLength);
 
    this._filterModel.setSort(filmsInfoSortLength);
    // this._filterModel.setSort({
    //   watchlist: films.slice().filter((item) => item.isWatchlist).length,
    //   history: films.slice().filter((item) => item.isViewed).length,
    //   favorites: films.slice().filter((item) => item.isFavorite).length,
    // });

  }

  _renderMenu() {
    const prevMenu = this._menuComponent;
    this._menuComponent = new MenuView(this._filterModel.getSort(), this._filterModel.getSortType().filter);
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
    this._filterModel.setSortType(this._filterModel.getSortType().sort, evt.target.getAttribute(`data-sort`), false);
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
  }

  _renderSort() {
    const sortPanelComponent = this._sortPanelComponent;
    this._sortPanelComponent = new SortPanelView(this._filterModel.getSortType().sort);
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
    this._filterModel.setSortType(evt.target.getAttribute(`data-sort`), this._filterModel.getSortType().filter, false);
    this._sortPanelComponent.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    //this.update();
  }

  _handleStatsItemClick(evt) {
    this._filterModel.setSortType(this._filterModel.getSortType().sort, this._filterModel.getSortType().filter, true);
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this._hideSort();
  }

  _hideSort() {
    this._sortPanel.hide();
  }

  _showSort() {
    this._sortPanel.show();
  }
}