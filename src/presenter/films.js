import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SiteMenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import ProfileView from '../view/profile';
import StatsView from '../view/stats';
import {
  replace,
  remove}
  from '../utils/dom';
import {updateItem} from '../utils/data';
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

const FILM_PER_PAGE = 5;
const siteBody = document.querySelector('body');

/**
 * Класс описывает презентер списка фильмов
 */
export default class FilmsList {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   */
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage) {
    this._filterPresenter = filterPresenter;
    this._filterModel = filterModel;
    this._filmsContainer = filmsContainer;
    this._filmsPerPage = filmsPerPage;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterBy = this._filterModel.getSortType().filterBy;
    this._sortBy = this._filterModel.getSortType().sortBy;

    this._filterModel.addObserver(() => this.observeFilms(this._filmsModel.getFilms(), null));
    this._filterModel.addObserver(this.observeProfileHistory.bind(this));
    this._filterPresenter = filterPresenter;
    this._filmPresenter = {};
    this._sourcedFilms = [];

    this._films = [];
    this._statsComponent = null;
    this._filterFilmsCount = {};
    this._menuComponent = null;
    this._sortPanelComponent = new SortPanelView();
    this._filmListComponent = new FilmListView();
    this._loadMoreComponent = new LoadmoreView();
    this._profileComponent = null;
    this._mainFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmListComponent.getElement().querySelector('.js-films-container');
    this._topRatedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-commented');
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    // this._handleSortItemClick = this._handleSortItemClick.bind(this);
    // this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupAction = this._handlePopupAction.bind(this);
    this._handlePopupCommentActions = this._handlePopupCommentActions.bind(this);
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupAction, this._handlePopupCommentActions, this._handlePopupCommentActions);
    this._filterBy = 'all';
    this._sortBy = 'default';
  }


  /**
   * Публичный метод инициализации
   */
  init() {
    console.log('films.js init');
    this._sourcedFilms = this._filmsModel.getFilms().slice();
    this._films = this._sourcedFilms.slice();
    this._renderedFilmsCount = this._filmsPerPage;
    //  naming
    this._statsComponent = new StatsView(this._sourcedFilms, `ALL_TIME`, profileRating(this._filterModel.getSort().history));
    this._renderFilmsContainer();
    console.log(this._statsComponent);
  }

  /**
   * Приватный метод обновление наполнения списка фильмов
   * @param {number} renderedFilms - количество отрисованных фильмов
   */
  update(renderedFilms) {
    this._clearList();
    if (renderedFilms) {
      this._renderedFilmsCount = renderedFilms;
    }
    let updatedFilms = this._sourcedFilms;
    this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));

    if (this._filterModel.getSort.history > 0) {
      this._renderProfile();
    }
    if (this._filterModel.getSortType().filter !== 'all') {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._filterModel.getSortType().filter]);
    }
    if (this._filterModel.getSortType().sort !== 'default') {
      updatedFilms.sort(compareValues(this._filterModel.getSortType().sort, 'desc'));
    }
    this._films = updatedFilms;
    this._filterPresenter.init();
    this._renderFilms();
  }

  observeFilms(films) {
    this._sourcedFilms = films.slice();
    this._clearList();
    let updatedFilms = this._sourcedFilms;
    if (this._filterModel.getSortType().filter !== `all` || this._filterModel.getSortType().sort !== `default`) {
      const {filter, sort} = this._filterModel.getSortType();
      if (filter !== `all`) {
        updatedFilms = films.filter((film) => film[filter]);
      }
      if (sort !== `default`) {
        updatedFilms.sort(compareValues(sort, `desc`));
        if (sort !== `default`) {
          updatedFilms.sort(compareValues(sort, `desc`));
        }
      }
    }

    if (this._filterModel.getSortType().stats === true) {
      this._hide();
    } else {
      this._show();
    }

    this._films = updatedFilms;
    this._renderFilms();
  }

  observeProfileHistory({sort}) {
    if (sort.history > 0) {
      this._renderProfile();
    }
  }

  _handleStatsDisplay() {
    this._statsComponent.show();
    this._filmList.hide();
    this._filterPresenter.hideSort();
  }

  _hide() {
    this._statsComponent.show();
    this._filmList.hide();
  }

  _show() {
    this._statsComponent.hide();
    this._filmList.show();
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает методы рендера фильмов (в т.ч в категориях: по рейтингу и кол-ву комментариев)
   */
  _renderFilmsContainer() {
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmListComponent);
    if (this._filterModel.getSort().history > 0) {
      this._renderProfile();
    }
    this._renderFilms();
    render(this._filmsContainer, this._statsComponent, RenderPosition.BEFOREEND);
    console.log(this._statsComponent);
    this._statsComponent.hide();
  }

  /**
   * Приватный метод рендера звания пользователя
   * Вызывается если у пользователя есть хотя бы один просмотренный фильм
   */
  _renderProfile() {
    const prevProfile = this._profileComponent;
    this._profileComponent = new ProfileView(this._filterModel.getSort().history);
    if (prevProfile) {
      replace(this._profileComponent, prevProfile);
    } else {
      render(siteBody.querySelector('.header'), this._profileComponent);
    }
  }

  /**
   * Приватный метод рендера меню (фильтации)
   */
  _renderMenu() {
    const prevMenu = this._menuComponent;
    this._menuComponent = new SiteMenuView(this._filterFilmsCount, this._filterBy);
    if (prevMenu) {
      this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));
      this._menuComponent = new SiteMenuView(this._filterFilmsCount, this._filterBy);
      replace(this._menuComponent, prevMenu);
    } else {
      render(this._filmsContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
    }
    this._menuComponent.setClickHandler((evt) => this._handleFilterItemClick(evt));
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
    //  Перебираем все презентеры
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
    //  Нужна связка к this._sourcedFilms во вторичных презентерах
    this._filmsModel.updateFilm(updatedFilm);
  }

  /**
   * Приватный метод обработки открытия попапа (клик по интерфейсу карточки фильма)
   * @param {object} film - данные о фильме, которые необходимо отрисовать в попапе
   */
  _handlePopupOpen(film) {
    this._popupPresenter.init(film);

    //  check later
    this._filterModel.setSort({
      watchlist: this._filmsModel.getFilms().slice().filter((item) => item.isWatchlist).length,
      history: this._filmsModel.getFilms().slice().filter((item) => item.isViewed).length,
      favorites: this._filmsModel.getFilms().slice().filter((item) => item.isFavorite).length,
    });
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
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

  /**
   * Приватный метод обработки фильма (добавление/удаление комментария комментария)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить (добавить комментарий)
   */
  _handlePopupCommentActions(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }
}
