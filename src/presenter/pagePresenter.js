import RatedFilmsPresenter from './ratedFilms';
import CommentedFilmsPresenter from './commentedFilms';
import FilmsPresenter from './films';
import EmptyPresenter from './empty';
import { render } from '../utils/render';
import FooterStatisticsView from '../view/count-films';

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
  }

  /**
   * Метод иницализации презентера
   * Запускает методы инициализации других презентеров
   */
  init () {
    this._initFilmsPresenter();
    this._initSubFilmsPresenters();
    this._renderFooterComponent();
  }

  /**
   * Метод инициализации презентера главного списка фильмов
   */
  _initFilmsPresenter () {
    if(this._filmsCount == 0) {
      this._initEmptyPresenter();
    }
    const filmsPresenter = new FilmsPresenter(this._siteMailElement);
    filmsPresenter.init(this._films);
  }

  /**
   * Метод инициализации презентеров "вторичных" списков фильмов
   */
  _initSubFilmsPresenters () {
    if(this._filmsCount == 0) {
      return;
    }

    const ratedFilmsPresenter = new RatedFilmsPresenter(this._siteMailElement);
    const commentedFilmsPresenter = new CommentedFilmsPresenter(this._siteMailElement);

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
