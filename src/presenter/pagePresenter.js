import RatedFilmsPresenter from './ratedFilms';
import CommentedFilmsPresenter from './commentedFilms';
import FilmsPresenter from './films';
import EmptyPresenter from './empty';
import FilterPresenter from './filter';
import { render } from '../utils/render';
import FooterStatisticsView from '../view/count-films';
import FilmsModel from '../model/films';
import FilterModel from '../model/filter';

import {
  filmsInfoSort,
  getFilmsInfoSortLength}
  from '../utils/sort';

import {
  FilmsPerSection}
  from '../utils/const';

/**
 * Класс описывает презентер страницы
 * Создан для регулирования вызовов презентеров и отрисовки компонентов
 */
export default class PagePresenter {

  /**
   * @param {Object} siteBody - HTML элемент (тег body)
   * @param {Object} siteMainElement - HTML элемент (контейнер главного списка фильмов)
   * @param {Object} siteFooterStatistics - HTML элемент (контейнер для компонента кол-ва фильмов)
   * @param {Object} films - массив с данными о фильмах
   * @constructor
   */
  constructor (siteBody, siteMainElement, siteFooterStatistics, films, api) {
    this._siteBody = siteBody;
    this._siteMainElement = siteMainElement;
    this._siteFooterStatistics = siteFooterStatistics;
    this._films = films;
    this._filmsCount = films.length;

    this._filterBy = 'all';
    this._sortBy = 'default';
    this._showStatsFlag = false;

    this._api = api;
  }

  /**
   * Метод иницализации презентера
   * Обьявляет модели
   * Устанавливает данные
   * Запускает методы инициализации других презентеров
   */
  init () {

    this._filterModel = new FilterModel();
    this._filterModel.setSortType(this._sortBy, this._filterBy, this._showStatsFlag);
    this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));
    this._filterModel.setFilterFilmsCount(this._filterFilmsCount);

    this._filmsModel = new FilmsModel();
    this._filmsModel.setFilms(this._films);

    this._emptyPresenter = new EmptyPresenter(this._siteMainElement);
    this._filterPresenter = new FilterPresenter(this._siteMainElement, this._filterModel, this._filmsModel);

    this._initFilmsPresenter();
    // this._initSubFilmsPresenters();
    this._renderFooterComponent();
  }

  /**
   * Метод инициализации презентера главного списка фильмов
   */
  _initFilmsPresenter () {
    this._filmsPresenter = new FilmsPresenter(this._siteMainElement, this._filmsModel, this._filterModel, this._filterPresenter, FilmsPerSection.MAIN, this._emptyPresenter, this._api);
    this._filmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентеров "вторичных" списков фильмов
   */
  _initSubFilmsPresenters () {
    this._filmsExtraContainer = this._siteMainElement.querySelector('.films');

    console.log(this._siteMainElement);
    console.log(this._filmsExtraContainer);

    this._ratedFilmsPresenter = new RatedFilmsPresenter(this._filmsExtraContainer, this._filmsModel, this._filterModel, FilmsPerSection.RATED, this._api);
    this._commentedFilmsPresenter = new CommentedFilmsPresenter(this._filmsExtraContainer, this._filmsModel, this._filterModel, FilmsPerSection.COMMENTED, this._api);

    this._ratedFilmsPresenter.init(this._films);
    this._commentedFilmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентера при отсутствии фильмов
   */
  _initEmptyPresenter () {
    this._emptyPresenter.init();
  }

  /**
   * Метод рендера нижнего компонента счетчика фильмов
   */
  _renderFooterComponent () {
    render(this._siteFooterStatistics, new FooterStatisticsView(this._filmsModel.getFilms().length));
  }

}
