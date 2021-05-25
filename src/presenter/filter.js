import MenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import {
  replace}
  from '../utils/dom';

import {
  render}
  from '../utils/render';

import {
  getFilmsInfoSortLength,
  filmsInfoSort}
  from '../utils/sort';

/**
 * Класс описывает презентер списка фильмов
 */
export default class FilterPresenter {

  /**
   * @param {Object} filterContainer - ссылка на HTML элемент куда надо отрисовывать элементы
   * @param {Object} filmsModel - модель фильмов
   * @param {Object} filterModel - модель фильтра
   * @constructor
   */
  constructor(filterContainer, filterModel, filmsModel) {
    //  Ссылки на DOM узлы
    this._filterContainer = filterContainer;

    //  Модели
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilter.bind(this));

    //  Компоненты
    this._menuComponent = null;
    this._sortPanelComponent = null;

    //  Слушатели
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleStatsItemClick = this._handleStatsItemClick.bind(this);
  }

  /**
   * Публичный метод инициализации
   * Вызывает методы рендера меню (фильтрации) и сортировки
   */
  init() {
    this._renderMenu();
    this._renderSort();
  }

  /**
   * Обработчик который будет исполнятся при _notify
   * Пересчитывает количество фильмов по параметрам фильтра
   * И вызывает метод инициализации презентера
   */
  observeFilter() {
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
    // this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    // evt.target.classList.add('main-navigation__item--active');
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
    // this._sortPanelComponent.getActiveMenuLink().classList.remove('sort__button--active');
    // evt.target.classList.add('sort__button--active');
  }

  /**
   * Обработчик клика по элементам компонента статистики
   * @param {Object} evt - объект события
   */
  _handleStatsItemClick() {
    this._filterModel.setSortType(this._filterModel.getSortBy(), this._filterModel.getFilterBy(), true);
    this._hideSort();
  }

  /**
   * Приватный метод скрытия сортировки
   */
  _hideSort() {
    this._sortPanelComponent.hide();
  }

  /**
   * Приватный метод показа сортировки
   */
  _showSort() {
    this._sortPanelComponent.show();
  }
}
