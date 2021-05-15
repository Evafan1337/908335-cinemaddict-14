import RatedFilmsPresenter from './ratedFilms';
import CommentedFilmsPresenter from './commentedFilms';
import FilmsPresenter from './films';
import EmptyPresenter from './empty';
import FilterPresenter from './filter';
import { render, RenderPosition } from '../utils/render';
import FooterStatisticsView from '../view/count-films';
import StatsView from '../view/count-films';
import FilmsModel from '../model/films';
import FilterModel from '../model/filter';

import {
  compareValues,
  filmsInfoSort,
  getFilmsInfoSortLength}
  from '../utils/sort';

const FilmsPerSection = {
  MAIN: 5,
  COMMENTED: 2,
  RATED: 2,
};


export default class PagePresenter {

  /**
   * Конструктор
   * @param {Object} siteBody - HTML элемент (тег body)
   * @param {Object} siteMainElement - HTML элемент (контейнер главного списка фильмов)
   * @param {Object} siteFooterStatistics - HTML элемент (контейнер для компонента кол-ва фильмов)
   * @param {Object} films - массив с данными о фильмах
   */
  constructor (siteBody, siteMainElement, siteFooterStatistics, films) {
    this._siteBody = siteBody;
    this._siteMainElement = siteMainElement;
    this._siteFooterStatistics = siteFooterStatistics;
    this._films = films;
    this._filmsCount = films.length;

    //  check later
    this._filterBy = 'all';
    this._sortBy = 'default';
    this._stats = false;
  }

  /**
   * Метод иницализации презентера
   * Запускает методы инициализации других презентеров
   */
  init () {

    this._filmsModel = new FilmsModel();
    this._filmsModel.setFilms(this._films);

    this._initFilmsPresenter();
    // this._initSubFilmsPresenters();
    this._renderFooterComponent();
    this._renderStats();
  }

  /**
   * Метод инициализации презентера главного списка фильмов
   */
  _initFilmsPresenter () {

    this._filterModel = new FilterModel();
    this._filterModel.setSortType(this._sortBy, this._filterBy, this._stats);

    this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));

    this._filterModel.setSort(this._filterFilmsCount);

    if(this._filmsModel.getFilms().length == 0) {
      this._initEmptyPresenter();
    }

    this._filterPresenter = new FilterPresenter(this._siteMainElement, this._filterModel, this._filmsModel);
    const filmsPresenter = new FilmsPresenter(this._siteMainElement, this._filmsModel, this._filterModel, this._filterPresenter, FilmsPerSection.MAIN);
    filmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентеров "вторичных" списков фильмов
   */
  _initSubFilmsPresenters () {
    if(this._filmsModel.getFilms().length == 0) {
      return;
    }

    this._filmsExtraContainer = this._siteMainElement.querySelector('.films');
    const ratedFilmsPresenter = new RatedFilmsPresenter(this._filmsExtraContainer, this._filmsModel, this._filterModel, this._filterPresenter, FilmsPerSection.RATED);
    const commentedFilmsPresenter = new CommentedFilmsPresenter(this._filmsExtraContainer, this._filmsModel, this._filterModel, this._filterPresenter, FilmsPerSection.COMMENTED);

    ratedFilmsPresenter.init(this._films);
    commentedFilmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентера при отсутствии фильмов
   */
  _initEmptyPresenter () {
    const emptyPresenter = new EmptyPresenter(this._siteMainElement);
    emptyPresenter.init();
  }

  /**
   * Метод рендера нижнего компонента счетчика фильмов
   */
  _renderFooterComponent () {
    render(this._siteFooterStatistics, new FooterStatisticsView(this._filmsCount));
  }

  _renderStats() {
    render(this._siteMainElement, new StatsView(this._films, `ALL_TIME`, `Sci-Fighter`).getElement(), RenderPosition.BEFOREEND);
  }

}
