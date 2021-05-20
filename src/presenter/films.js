import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SortPanelView from '../view/sort-panel';
import ProfileView from '../view/profile';
import StatsView from '../view/stats';
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
  filmsInfoSort,
  getFilmsInfoSortLength}
  from '../utils/sort';
import {
  profileRating
} from '../utils/const';

import FilmCardPresenter from './filmCard';
import FilmPopupPresenter from './filmPopup';

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
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage) {

    //  Модели
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    //  Добавление наблюдателей - обработчиков
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterModel.addObserver(() => this.observeFilms(this._filmsModel.getFilms(), null));
    this._filterModel.addObserver(this.observeProfileHistory.bind(this));

    //  Параметры сортировки и фильтрации
    this._filterBy = this._filterModel.getFilterBy();
    this._sortBy = this._filterModel.getSortBy();

    //  Данные
    this._sourcedFilms = [];
    this._films = [];

    //  Счетчики
    this._filterFilmsCount = {};
    this._renderedFilmsCount = filmsPerPage;
    this._filmsPerPage = filmsPerPage;

    //  Компоненты
    this._statsComponent = null;
    this._menuComponent = null;
    this._sortPanelComponent = new SortPanelView();
    this._filmListComponent = new FilmListView();
    this._loadMoreComponent = new LoadmoreView();
    this._profileComponent = null;

    //  Ссылки на DOM узлы
    this._filmsContainer = filmsContainer;
    //  Верное ли именование?
    this._mainFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmListComponent.getElement().querySelector('.js-films-container');
    this._topRatedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-commented');

    //  Слушатели
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupAction = this._handlePopupAction.bind(this);
    // this._handlePopupCommentActions = this._handlePopupCommentActions.bind(this);

    //  Презентеры
    this._filmPresenter = {};
    this._filterPresenter = filterPresenter;
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupAction, this._handlePopupAction, this._handlePopupAction);
  }


  /**
   * Публичный метод инициализации
   */
  init() {
    this._sourcedFilms = this._filmsModel.getFilms().slice();
    this._films = this._sourcedFilms.slice();
    this._renderedFilmsCount = this._filmsPerPage;
    this._statsComponent = new StatsView(this._sourcedFilms, 'ALL_TIME', profileRating(this._filterModel.getFilterFilmsCount().isViewed));
    this._renderFilmsContainer();
  }

  /**
   * Обработчик который будет исполнятся при _notify
   * @param {Array} films - результирующий массив фильмов (данные)
   * Которые будут перерисованы
   */
  observeFilms(films) {
    this._sourcedFilms = films.slice();
    this._clearList();
    let updatedFilms = this._sourcedFilms;

    const filterBy = this._filterModel.getFilterBy();
    const sortBy = this._filterModel.getSortBy();

    if (filterBy !== 'all') {
      updatedFilms = films.filter((film) => film[filterBy]);
    }

    if (sortBy !== 'default') {
      updatedFilms.sort(compareValues(sortBy, 'desc'));
    }

    if (this._filterModel.getShowStatsFlag() === true) {
      this._hide();
    } else {
      this._show();
    }

    this._films = updatedFilms;
    this._renderFilms();
  }

  /**
   * Обработчик который будет исполнятся при _notify
   * @param {Object} filterFilmsCount - количество фильмов
   * Проверяет на наличие просмотренных фильмов
   * Если есть то рисует плашку профиля
   */
  observeProfileHistory({filterFilmsCount}) {
    if (filterFilmsCount.isViewed > 0) {
      this._renderProfile();
    }
  }

  /**
   * Приватный метод скрытия интерфейса для показа статистики
   */
  _hide() {
    this._statsComponent.show();
    this._filmListComponent.hide();
  }

  /**
   * Приватный метод показа интерфейса и скрытие статистики (противоположность this._hide)
   */
  _show() {
    this._statsComponent.hide();
    this._filmListComponent.show();
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает метод инициализации презентера фильтров
   * Вызывает методы рендера фильмов
   */
  _renderFilmsContainer() {
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmListComponent);
    if (this._filterModel.getFilterFilmsCount().isViewed > 0) {
      this._renderProfile();
    }
    this._renderFilms();
    render(this._filmsContainer, this._statsComponent);
    this._statsComponent.hide();
  }

  /**
   * Приватный метод рендера звания пользователя
   * Вызывается если у пользователя есть хотя бы один просмотренный фильм
   */
  _renderProfile() {
    const prevProfile = this._profileComponent;
    this._profileComponent = new ProfileView(this._filterModel.getFilterFilmsCount().isViewed);
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

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   * @param {Object} film - данные о фильме
   * @param {Object} container - контейнер куда надо отрисовать компонент фильма
   */
  _renderCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmAction, this._handlePopupOpen);
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
    this._filterPresenter = {};
    remove(this._loadMoreComponent);
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
    this._popupPresenter.init(film);

    //Можно брать из модели...
    const currentFilterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));
    this._filterModel.setFilterFilmsCount(currentFilterFilmsCount);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   * И добавление/удаление комментария
   */
  _handlePopupAction(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popupPresenter.init(updatedFilm);
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
