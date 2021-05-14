import FilmsPresenter from './films';
import {compareValues} from '../utils/sort';
import {render, RenderPosition} from '../utils/render';


const FILM_PER_PAGE = 2;
const siteBody = document.querySelector('body');

/**
 * Класс описывает презентер списка фильмов отсортированных по кол-ву комментариев
 * Наследник FilmsPresenter
 */
export default class CommentedFilmsPresenter extends FilmsPresenter {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовывать элементы
   */
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage) {
    this._filterPresenter = filterPresenter;
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterModel = filterModel;
    this._films = [];
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = null;
    this._sourcedFilms = [];
    this._filmPresenter = {};
    this._filmList = new FilmListCommented();
    this._mainFilmList = null;
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
  }

  /**
   * Публичный метод инициализации
   */
  init() {
    this._sourcedFilms = this._filmsModel.getFilms().sort(compareValues(`comments`, `desc`));
    this._films = this._filmsModel.getFilms().sort(compareValues(`comments`, `desc`));
    this._renderedFilmsCount = this._filmsPerPage;
    this._renderFilmsContainer();
  }

  observeFilms(films, updatedFilm) {
    this._clearList();
    this._sourcedFilms = films.slice().sort(compareValues(`comments`, `desc`));
    let updatedFilms = this._sourcedFilms;

    if (updatedFilm === null) {
      return this._sourcedFilms;
    }

    this._films = updatedFilms.slice().sort(compareValues(`comments`, `desc`));
    this._renderFilms();
  }

  _renderFilmsContainer() {
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-commented`);
    this._renderFilms();
  }

  _renderCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmChange, this._handlePopupDisplay);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  /**
   * Приватный метод рендера определенного количества фильмов
   * @param {number} from - индекс с какого необходимо начать отрисовку
   * @param {number} to - индекс до какого элемента необходимо произвести отрисовку
   */
  _renderFilmList(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(film, this._mainFilmList));
  }

  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));
  }

  _handleFilmChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
  }

  _handlePopupRemoveComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handlePopupChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }

  _handleAddComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
  }

}
