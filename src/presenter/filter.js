import MenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import {
  replace,
  remove}
  from '../utils/dom';

import {
  render}
  from '../utils/render';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._menuComponent = null;
    this._sortPanelComponent = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderSort();
  }

  _renderMenu() {
    const prevMenu = this._menuComponent;
    this._menuComponent = new MenuView(this._filterModel.getSort(), this._filterModel.getSortType().filter);
    if (prevMenu) {
      replace(this._menuComponent, prevMenu);
    } else {
      render(this._filterContainer, new MenuView(this._filterModel.getSort(), this._filterModel.getSortType().filter));
    }
    this._menuComponent.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  _handleFilterItemClick(evt) {
    this._filterModel.setSortType(this._filterModel.getSortType().sort, evt.target.getAttribute('data-sort'));
    //this.update();
  }

  _renderSort() {
    const sortPanelComponent = this._sortPanelComponent;
    this._sortPanelComponent = new SortPanelView();
    if (sortPanelComponent) {
      replace(this._sortPanelComponent, sortPanelComponent);
    } else {
      render(this._filterContainer, new SortPanelView());
    }
    this._sortPanelComponent.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  _handleSortItemClick(evt) {
    this._filterModel.setSortType(evt.target.getAttribute('data-sort'), this._filterModel.getSortType().filter);
    this._sortPanelComponent.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    //this.update();
  }
}