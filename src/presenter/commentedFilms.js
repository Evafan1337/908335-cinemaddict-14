import FilmListCommentedView from '../view/films-list-commented';
import {compareValues} from '../utils/sort';
import {render} from '../utils/render';
import FilmCardPresenter from './filmCard';
import FilmPopupPresenter from './filmPopup';

import CommentsModel from '../model/comments';

//  Может в утилиты?
const siteBody = document.querySelector('body');

/**
 * Класс описывает презентер списка фильмов отсортированных по кол-ву комментариев
 */
export default class CommentedFilmsPresenter {

  /**
   * @param {Object} filmsContainer - ссылка на HTML элемент куда надо отрисовывать элементы
   * @param {Object} filmsModel - модель фильмов
   * @param {Object} filterModel - модель фильтра
   * @param {Object} filterPresenter - презентер фильтра
   * @param {number} filmsPerPage - количество фильмов для отрисовки за "проход"
   * @constructor
   */
  constructor(filmsContainer, filmsModel, filterModel, filmsPerPage, api) {

    //  Ссылки на DOM узлы
    this._filmsContainer = filmsContainer;
    this._mainFilmList = null;

    //  Модели
    this._commentsModel = new CommentsModel();
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));

    //  Счетчики
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = null;

    //  Флаги
    this._isLoading = true;

    //  Данные
    this._films = [];
    this._sourcedFilms = [];

    //  Компоненты
    this._filmListComponent = new FilmListCommentedView();

    //  Слушатели
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupAction = this._handlePopupAction.bind(this);
    //  Презентеры
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupAction, this._handleDeleteComment, this._handleAddComment, this._commentsModel);
    // this._filterPresenter = filterPresenter;
    this._filmPresenter = {};

  }

  /**
   * Публичный метод инициализации
   */
  init() {
    this._sourcedFilms = this._filmsModel.getFilms();
    this._films = this._sourcedFilms.slice().sort(compareValues('comments', 'desc'));
    this._renderedFilmsCount = this._filmsPerPage;

    if (this._films.length > 0) {
      this._renderFilmsContainer();
    }
  }

  /**
   * Обработчик который будет исполнятся при _notify
   * @param {Array} films - результирующий массив фильмов (данные)
   * @param {Object} updatedFilm - данные фильма, который подвергся изменению
   * Которые будут перерисованы
   * По сути предусматривает изменение списка фильмов в "Most commented"
   */
  observeFilms(films, updatedFilm) {

    if (this._isLoading) {
      this.init();
    }

    this._clearList();
    this._sourcedFilms = films.slice().sort(compareValues('comments', 'desc'));
    const updatedFilms = this._sourcedFilms;

    if (updatedFilm === null) {
      return this._sourcedFilms;
    }

    this._films = updatedFilms.slice().sort(compareValues('comments', 'desc'));
    if (this. _films.length > 0){
      console.log('_renderFilms');
      this._renderFilms();
    }
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает метод инициализации презентера фильтров
   * Вызывает методы рендера фильмов ()
   */
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmListComponent);
    this._mainFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-commented');
    this._renderFilms();
  }

  /**
   * Приватный метод отрисовки фильмов
   * Вызывает метод _renderFilmList
   */
  _renderFilms() {
    console.log('_renderFilms:', this._renderedFilmsCount);
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));
  }

  /**
   * Приватный метод рендера определенного количества фильмов
   * @param {number} from - индекс с какого необходимо начать отрисовку
   * @param {number} to - индекс до какого элемента необходимо произвести отрисовку
   */
  _renderFilmList(from, to) {
    console.log('_renderFilmList');
    console.log(from);
    console.log(to);
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(film, this._mainFilmList));
  }

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   * @param {Object} film - данные о фильме
   * @param {Object} container - контейнер куда надо отрисовать компонент фильма
   */
  _renderCard(film, container) {
    console.log('_renderCard');
    console.log(film);
    console.log(container);
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmAction, this._handlePopupOpen);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу карточки)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handleFilmAction(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
  }

  /**
   * Приватный метод обработки открытия попапа (клик по интерфейсу карточки фильма)
   * @param {object} film - данные о фильме, которые необходимо отрисовать в попапе
   */
  _handlePopupOpen(film) {
    this._api.getComments(film).then((comments) => {
      this._commentsModel.setCommentsFilm(comments, film);
    })
      .catch(() => {
        this._commentsModel.setCommentsFilm([], {});
      });
    this._popupPresenter.init(film, this._commentsModel.getCommentsFilm());
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * И добавление/удаление комментария
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handlePopupAction(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }

  _handleAddComment(updatedFilm, comment) {
    this._api.addComment(comment, updatedFilm).then((update) => {
      this._commentsModel.addComment(update[1], update[0]);
      this._filmsModel.updateFilm(update[0]);
      this._popupPresenter.init(update[0], this._commentsModel.getCommentsFilm());
    });
  }

  _handleDeleteComment(updatedFilm, comment) {
    this._api.deleteComment(comment).then(() => {
      this._commentsModel.removeComment(comment, updatedFilm);
    });
    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
    });
    this._popupPresenter.init(updatedFilm, this._commentsModel.getCommentsFilm());
  }

  /**
   * Приватный метод очистки списка фильмов
   * Удаляются презентеры (компоненты)
   * Удаляется кнопка showMore
   */
  _clearList() {
    console.log('_clearList');
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
  }

}
