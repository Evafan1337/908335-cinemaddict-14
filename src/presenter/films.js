import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SiteMenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import ProfileView from '../view/profile';
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
  constructor(filmsContainer, filmsModel) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._filmsModel = filmsModel;
    this._films = [];
    this._sourcedFilms = [];
    this._filterFilmsCount = {};
    this._menuComponent = null;
    this._filmPresenter = {};
    this._sortPanelComponent = new SortPanelView();
    this._filmListComponent = new FilmListView();
    this._loadMoreComponent = new LoadmoreView();
    this._profileComponent = null;
    this._mainFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmListComponent.getElement().querySelector('.js-films-container');
    this._topRatedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmListComponent.getElement().querySelector('.js-film-list-commented');
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handlePopupCommentActions = this._handlePopupCommentActions.bind(this);
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupCommentActions, this._handlePopupCommentActions);
    this._filterBy = 'all';
    this._sortBy = 'default';
  }


  /**
   * Публичный метод инициализации
   */
  init() {
    this._sourcedFilms = this._filmsModel.getFilms();
    this._films = this._filmsModel.getFilms();
    this._filterFilmsCount = getFilmsInfoSortLength(filmsInfoSort(this._films));
    if (this._filterFilmsCount.isViewed > 0) {
      this._renderProfile();
    }
    this._renderFilmsContainer();
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

    if (this._filterFilmsCount.isViewed > 0) {
      this._renderProfile();
    }
    if (this._filterBy !== 'all') {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._filterBy]);
    }
    if (this._sortBy !== 'default') {
      updatedFilms.sort(compareValues(this._sortBy, 'desc'));
    }
    this._films = updatedFilms;
    this._renderFilms();
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает методы рендера фильмов (в т.ч в категориях: по рейтингу и кол-ву комментариев)
   */
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmListComponent);
    this._renderSort(this._filmsContainer);
    this._renderMenu(this._filmsContainer);
    this._renderFilms();
  }

  /**
   * Приватный метод рендера звания пользователя
   * Вызывается если у пользователя есть хотя бы один просмотренный фильм
   */
  _renderProfile() {
    const prevProfile = this._profileComponent;
    this._profileComponent = new ProfileView(this._filterFilmsCount.isViewed);
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

    if (this._films.length > FILM_PER_PAGE) {
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
    this._renderedFilmsCount = FILM_PER_PAGE;
    remove(this._loadMoreComponent);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу карточки)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handleFilmAction(updatedFilm) {
    //  Нужна связка к this._sourcedFilms во вторичных презентерах

    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._renderProfile();
    this._renderMenu(this._filmsContainer);
    if (!updatedFilm[this._filterBy]) {
      this.update(this._renderedFilmsCount);
    } else {
      this._filmPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  /**
   * Приватный метод обработки открытия попапа (клик по интерфейсу карточки фильма)
   * @param {object} film - данные о фильме, которые необходимо отрисовать в попапе
   */
  _handlePopupOpen(film) {
    this._popupPresenter.init(film);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handlePopupChange(updatedFilm) {
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    if (!updatedFilm[this._filterBy]) {
      this.update();
    } else {
      this._filmPresenter[updatedFilm.id].init(updatedFilm);
    }
    this._renderProfile();
    this._renderMenu(this._filmsContainer);
    this._popupPresenter.init(updatedFilm);
  }

  /**
   * Приватный метод, описывающий работу кнопки ShowMore
   * Передается аргументом в методе _renderLoadMore
   */
  _handleLoadMoreButtonClick() {
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + FILM_PER_PAGE);
    this._renderedFilmsCount += FILM_PER_PAGE;

    if (this._renderedFilmsCount >= (this._films.length)) {
      this._loadMoreComponent.getElement().remove();
      this._loadMoreComponent.removeElement();
      this._renderedFilmsCount = FILM_PER_PAGE;
    }
  }

  /**
   * Приватный метод, описывающий клик по панели фильтрации
   * @param {Object} evt - объект событий
   */
  _handleFilterItemClick(evt) {
    this._filterBy = evt.target.dataset.sort;
    this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this.update();
  }

  /**
   * Приватный метод, описывающий клик по панели сортировки
   * @param {Object} evt - объект событий
   */
  _handleSortItemClick(evt) {
    this._sortPanelComponent.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    this._sortBy = evt.target.dataset.sort;
    this.update();
  }

  /**
   * Приватный метод обработки фильма (добавление/удаление комментария комментария)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить (добавить комментарий)
   */
  _handlePopupCommentActions(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }
}
