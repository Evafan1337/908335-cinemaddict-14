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
    this._siteMailElement = siteMainElement;
    this._siteFooterStatistics = siteFooterStatistics;
    this._films = films;
    this._filmsCount = films.length;

    //  check later
    this._filterBy = 'all';
    this._sortBy = 'default';
  }

  /**
   * Метод иницализации презентера
   * Запускает методы инициализации других презентеров
   */
  init () {

    this._filmsModel = new FilmsModel();
    this._filmsModel.setFilms(this._films);

    this._initFilmsPresenter();
    this._initSubFilmsPresenters();
    this._renderFooterComponent();
  }

  /**
   * Метод инициализации презентера главного списка фильмов
   */
  _initFilmsPresenter () {

    const filterModel = new FilterModel();
    filterModel.setSortType(this._sortBy, this._filterBy);

    this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));

    filterModel.setSort(this._filterFilmsCount);

    if(this._filmsCount == 0) {
      this._initEmptyPresenter();
    }

    const filterPresenter = new FilterPresenter(this._siteMailElement, filterModel);
    const filmsPresenter = new FilmsPresenter(this._siteMailElement, this._filmsModel, filterModel, filterPresenter, FilmsPerSection.MAIN);
    filmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентеров "вторичных" списков фильмов
   */
  _initSubFilmsPresenters () {
    if(this._filmsCount == 0) {
      return;
    }

    const filmsExtraContainer = siteMainElement.querySelector(`.films`);
    const ratedFilmsPresenter = new RatedFilmsPresenter(filmsExtraContainer, this._filmsModel, filterPresenter, FilmsPerSection.RATED);
    const commentedFilmsPresenter = new CommentedFilmsPresenter(filmsExtraContainer, this._filmsModel, filterPresenter, FilmsPerSection.COMMENTED);

    ratedFilmsPresenter.init(this._films);
    commentedFilmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентера при отсутствии фильмов
   */
  _initEmptyPresenter () {
    const emptyPresenter = new EmptyPresenter(this._siteMailElement);
    emptyPresenter.init();
  }

  /**
   * Метод рендера нижнего компонента счетчика фильмов
   */
  _renderFooterComponent () {
    render(this._siteFooterStatistics, new FooterStatisticsView(this._filmsCount));
  }

}
