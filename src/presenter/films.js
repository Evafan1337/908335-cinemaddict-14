import LoadmoreView from '../view/loadmore';
import ProfileView from '../view/profile';
import LoadingView from '../view/loading';
import StatsView from '../view/stats';
import FilmListView from '../view/films-list';
import SortPanelView from '../view/sort-panel';
import FilmListRatedView from '../view/films-list-rated';
import FilmListCommentedView from '../view/films-list-commented';

import {
  replace,
  remove}
  from '../utils/dom';
import {
  render,
  RenderPosition}
  from '../utils/render';
import {
  compareValues,
  getFilmsInfoSortLength,
  groupFilms}
  from '../utils/sort';
import {
  profileRating,
  FilmsPerSection,
  UpdateType,
  FilterByParam,
  SortByParam,
  SortOrder,
  StatPeriodMap
} from '../utils/const';

import FilmCardPresenter from './film-card';
import FilmPopupPresenter from './film-popup';

import CommentsModel from '../model/comments';

const siteBody = document.querySelector('body');

/**
 * Класс описывает презентер списка фильмов
 */
export default class FilmsList {

  /**
   * @param {Object} filmsContainer - ссылка на HTML элемент куда надо отрисовывать элементы
   * @param {Object} filmsModel - модель фильмов
   * @param {Object} filterModel - модель фильтра
   * @param {Object} filterPresenter - презентер фильтра
   * @param {number} filmsPerPage - количество фильмов для отрисовки за "проход"
   * @constructor
   */
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage, emptyPresenter, api) {

    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentsModel = new CommentsModel(api);

    this._filmsModel.addObserver(this.observeProfileHistory.bind(this));
    this._commentsModel.addObserver(this._handleModelEvent.bind(this));
    this._filmsModel.addObserver(this._handleModelEvent.bind(this));
    this._filterModel.addObserver(this._handleModelEvent.bind(this));

    this._filterBy = this._filterModel.getFilterBy();
    this._sortBy = this._filterModel.getSortBy();

    this._sourcedFilms = [];
    this._films = [];

    this._filterFilmsCount = {};
    this._renderedFilmsCount = filmsPerPage;
    this._filmsPerPage = filmsPerPage;

    this._isLoading = true;

    this._api = api;

    this._statsComponent = null;
    this._menuComponent = null;
    this._sortPanelComponent = new SortPanelView();
    this._filmListComponent = null;
    this._loadMoreComponent = new LoadmoreView();
    this._loadingComponent = new LoadingView();
    this._profileComponent = null;

    this._filmsContainer = filmsContainer;
    this._mainFilmList = null;
    this._loadMoreContainer = null;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupAction = this._handlePopupAction.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleStatsDisplay = this._handleStatsDisplay.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmPresenter = {};
    this._topRatedFilmsPresenter = {};
    this._topCommentedPresenter = {};
    this._filterPresenter = filterPresenter;
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupAction, this._handleDeleteComment, this._handleAddComment, this._commentsModel, this._filterModel);
    this._emptyPresenter = emptyPresenter;
  }

  /**
   * Публичный метод инициализации
   */
  init() {
    this._sourcedFilms = this._filmsModel.getFilms().slice();
    this._films = this._sourcedFilms.slice();
    this._renderedFilmsCount = this._filmsPerPage;

    remove(this._loadingComponent);
    this._filterPresenter.init();
    if (this._sourcedFilms.length > 0) {
      this._renderFilmsContainer();
    } else {
      this._emptyPresenter.init();
    }
  }

  _handleModelEvent(updateType, comments, film, userAction, transferResult) {
    comments = [];

    if(transferResult === false) {
      return;
    }

    this._renderStats();

    switch (updateType) {
      case UpdateType.PATCH:
        this._updateBoard(film);
        break;
      case UpdateType.MAJOR:
        this._clearList();
        this._updateFilmsListMajor();
        break;
    }
  }

  _updateFilmsListMajor(){
    this._clearList();

    const films = this._filmsModel.getFilms();

    this._sourcedFilms = films.slice();
    let updatedFilms = this._sourcedFilms;

    const filterBy = this._filterModel.getFilterBy();
    const sortBy = this._filterModel.getSortBy();

    if (filterBy !== FilterByParam.ALL) {
      updatedFilms = films.filter((film) => film[filterBy]);
    }

    if (sortBy !== SortByParam.DEFAULT) {
      updatedFilms.sort(compareValues(sortBy, SortOrder.DESC));
    }

    if (this._filterModel.getShowStatsFlag() === true) {
      this._hide();
    } else {
      this._show();
    }

    this._films = updatedFilms;

    if (this._films.length > 0) {
      this._emptyPresenter.destroy();
      this._renderFilms();
    } else {
      this._emptyPresenter.init();
    }
  }

  _updateBoard(data) {
    const updatedCards = Object.keys(this._filmPresenter).filter((key) => this._filmPresenter[key]._film.id === data.id);
    updatedCards.forEach((card) => this._filmPresenter[card].init(data));
  }

  /**
   * Обработчик который будет исполнятся при _notify
   * @param {Object} filterFilmsCount - количество фильмов
   * Проверяет на наличие просмотренных фильмов
   * Если есть то рисует плашку профиля
   */
  observeProfileHistory() {
    const filmsInfoSortLength = getFilmsInfoSortLength(groupFilms(this._filmsModel.getFilms()));
    const currentViewFilmsCount = filmsInfoSortLength.isViewed;
    if(currentViewFilmsCount > 0) {
      this._profileComponent.show();
      this._renderProfile(currentViewFilmsCount);
    } else {
      this._profileComponent.hide();
    }
  }

  /**
   * Приватный метод скрытия интерфейса для показа статистики
   */
  _hide() {
    if (this._statsComponent !== null) {
      this._statsComponent.show();
      this._filmListComponent.hide();
    }
  }

  /**
   * Приватный метод показа интерфейса и скрытие статистики (противоположность this._hide)
   */
  _show() {
    if (this._statsComponent !== null) {
      this._statsComponent.hide();
      this._filmListComponent.show();
    }
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает метод инициализации презентера фильтров
   * Вызывает методы рендера фильмов
   */
  _renderFilmsContainer() {
    const prevList = this._filmListComponent;
    this._filmListComponent = new FilmListView();

    this._filmTopRatedComponent = new FilmListRatedView();
    this._filmTopCommentedComponent = new FilmListCommentedView();

    this._topRatedFilmList = this._filmTopRatedComponent.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmTopCommentedComponent.getElement().querySelector('.js-film-list-commented');

    if (prevList) {
      replace(this._filmListComponent, prevList);
    } else {
      render(this._filmsContainer, this._filmListComponent, RenderPosition.BEFOREEND);
    }

    render(this._filmListComponent.getElement(), this._filmTopRatedComponent);
    render(this._filmListComponent.getElement(), this._filmTopCommentedComponent);

    this._mainFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmListComponent.getElement().querySelector('.js-films-container');

    const currentViewFilmsCount = this._filterModel.getFilterFilmsCount().isViewed;
    if (currentViewFilmsCount > 0) {
      this._renderProfile(currentViewFilmsCount);
    }
    this._renderFilms();

    this._renderTopRatedFilmList();
    this._renderTopCommentedFilmList();

    this._renderStats();
    this._statsComponent.hide();
  }

  _renderStats() {
    const prevStats = this._statsComponent;
    const viewedFilms = groupFilms(this._filmsModel.getFilms()).isViewed;

    this._statsComponent = new StatsView(viewedFilms, StatPeriodMap.ALL_TIME, profileRating(this._filterModel.getFilterBy().isViewed));
    if (prevStats) {
      replace(this._statsComponent, prevStats);
    } else {
      render(this._filmsContainer, this._statsComponent, RenderPosition.BEFOREEND);
    }
  }


  /**
   * Приватный метод рендера звания пользователя
   * Вызывается если у пользователя есть хотя бы один просмотренный фильм
   */
  _renderProfile(currentViewFilmsCount) {
    const prevProfile = this._profileComponent;
    this._profileComponent = new ProfileView(currentViewFilmsCount);
    if (prevProfile) {
      replace(this._profileComponent, prevProfile);
    } else {
      render(siteBody.querySelector('.header'), this._profileComponent);
    }
  }

  /**
   * Приватный метод отрисовки панели сортировки
   */
  _renderSort() {
    render(this._filmsContainer, this._sortPanelComponent, RenderPosition.AFTERBEGIN);
    this._sortPanelComponent.setClickHandler((evt) => this._handleSortItemClick(evt));
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

  _renderTopRatedFilmList(){
    this._films
      .sort(compareValues(SortByParam.RATING, SortOrder.DESC))
      .slice(0,FilmsPerSection.RATED)
      .forEach((film) => this._renderTopRatedFilmCard(film, this._topRatedFilmList));
  }

  _renderTopCommentedFilmList(){
    this._films
      .sort(compareValues(SortByParam.COMMENTS, SortOrder.DESC))
      .slice(0,FilmsPerSection.COMMENTED)
      .forEach((film) => this._renderTopCommentedFilmCard(film, this._topCommentedFilmList));
  }

  _renderTopRatedFilmCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmAction, this._handlePopupOpen, this._filterModel);
    filmPresenter.init(film);
    this._topRatedFilmsPresenter[film.id] = filmPresenter;
  }

  _renderTopCommentedFilmCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmAction, this._handlePopupOpen, this._filterModel);
    filmPresenter.init(film);
    this._topCommentedPresenter[film.id] = filmPresenter;
  }

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   * @param {Object} film - данные о фильме
   * @param {Object} container - контейнер куда надо отрисовать компонент фильма
   */
  _renderCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmAction, this._handlePopupOpen, this._filterModel);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  /**
   * Приватный метод рендера кнопки ShowMore
   * Устанавливает обработчик, описанный в this._handleLoadMoreButtonClick
   */
  _renderLoadMore() {
    render(this._loadMoreContainer, this._loadMoreComponent);
    this._loadMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  /**
   * Приватный метод отрисовки фильмов
   * Вызывает метод _renderFilmList
   * Если количество фильмов больше чем FILM_PER_PAGE
   * То дополнительно вызывает метод рендера кнопки ShowMore
   */
  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));
    if (this._films.length > this._renderedFilmsCount) {
      this._renderLoadMore();
    }
  }

  /**
   * Приватный метод очистки списка фильмов
   * Удаляются презентеры (компоненты)
   * Удаляется кнопка showMore
   */
  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    remove(this._loadMoreComponent);
  }

  _handleStatsDisplay() {
    this._statsComponent.show();
    this._filmListComponent.hide();
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу карточки)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handleFilmAction(updatedFilm, updateType) {
    this._filmsModel.updateFilm(updatedFilm, updateType);
  }

  /**
   * Приватный метод обработки открытия попапа (клик по интерфейсу карточки фильма)
   * @param {object} film - данные о фильме, которые необходимо отрисовать в попапе
   */
  _handlePopupOpen(film) {
    this._commentsModel.setCommentsFilm(film, UpdateType.INIT);
    this._popupPresenter.init(film);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   * И добавление/удаление комментария
   */
  _handlePopupAction(updatedFilm, updateType) {
    this._filmsModel.updateFilm(updatedFilm, updateType);
    this._popupPresenter.init(updatedFilm);
  }

  _handleAddComment(updatedFilm, comment, updateType, userAction) {
    this._commentsModel.addComment(comment, updatedFilm, updateType, userAction);
    this._filmsModel.updateFilm(updatedFilm);
  }

  _handleDeleteComment(updatedFilm, comment, updateType, userAction) {
    this._commentsModel.removeComment(comment, updatedFilm, UpdateType.PATCH, userAction);
    this._filmsModel.updateFilm(updatedFilm);
  }

  /**
   * Приватный метод, описывающий работу кнопки ShowMore
   * Передается аргументом в методе _renderLoadMore
   */
  _handleLoadMoreButtonClick() {
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + this._filmsPerPage);
    this._renderedFilmsCount += this._filmsPerPage;

    if (this._renderedFilmsCount >= (this._films.length)) {
      this._loadMoreComponent.getElement().remove();
      this._loadMoreComponent.removeElement();
      this._renderedFilmsCount = this._filmsPerPage;
    }
  }
}
