import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SiteMenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import {
  render,
  compareValues,
  RenderPosition,
  updateItem
} from '../utils';
import FilmCardPresenter from './filmCard';
import FilmPopupPresenter from './filmPopup';

const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;
const siteBody = document.querySelector('body');

/**
 * Класс описывает презентер списка фильмов
 */
export default class FilmsList {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   */
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._films = null;
    this._sort = {};
    this._menuComponent = {};
    this._filmPresenter = {};
    this._sortPanelView = new SortPanelView();
    this._filmListView = new FilmListView();
    this._loadMoreView = new LoadmoreView();
    this._mainFilmList = this._filmListView.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmListView.getElement().querySelector('.js-films-container');
    this._topRatedFilmList = this._filmListView.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmListView.getElement().querySelector('.js-film-list-commented');
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._popupPresenter = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
    this._sortType = {
      sort: 'default',
      filter: 'all',
    };
  }


  /**
   * Публичный метод инициализации
   */
  init(films, sortInfo) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._sort = sortInfo;
    this._menuComponent = new SiteMenuView(this._sort);
    this._renderFilmsContainer();
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает методы рендера фильмов (в т.ч в категориях: по рейтингу и кол-ву комментариев)
   */
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmListView);
    this._renderSort(this._filmsContainer);
    this._renderMenu(this._filmsContainer);
    this._renderFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }

  /**
   * Приватный метод обновление наполнения списка фильмов
   */
  update() {
    this._mainFilmList.innerHTML = '';
    let updatedFilms = this._sourcedFilms;
    if (this._sortType.filter !== 'all') {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._sortType.filter]);
    }
    if (this._sortType.sort !== 'default') {
      updatedFilms.sort(compareValues(this._sortType.sort, 'desc'));
    }
    this._films = updatedFilms;
    this._renderFilms();
  }

  /**
   * Приватный метод рендера меню (фильтации)
   */
  _renderMenu() {
    render(this._filmsContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
    this._menuComponent.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   * @param {Object} film - данные о фильме
   * @param {Object} container - контейнер куда надо отрисовать компонент фильма
   */
  _renderCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmChange, this._handlePopupDisplay);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  /**
   * Приватный метод отрисовки панели сортировки
   */
  _renderSort() {
    render(this._filmsContainer, this._sortPanelView, RenderPosition.AFTERBEGIN);
    this._sortPanelView.setClickHandler((evt) => this._handleSortItemClick(evt));
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
    render(this._loadMoreContainer, this._loadMoreView);
    this._loadMoreView.setClickHandler(this._handleLoadMoreButtonClick);
  }

  /**
   * Приватный метод отрисовки фильмов
   * Вызывает метод _renderFilmList
   * Если количество фильмов больше чем FILM_PER_PAGE
   * То дополнительно вызывает метод рендера кнопки ShowMore
   */
  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, FILM_PER_PAGE));

    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
  }

  /**
   * Приватный метод рендера фильмов, отсортированных по рейтингу
   */
  _renderRatedFilms() {
    for (let i = 0; i < FILM_RATED_COUNT; i++) {
      this._renderCard(this._filmsRated()[i], this._topRatedFilmList);
    }
  }

  /**
   * Приватный метод рендера фильмов, отсортированных по количеству комментариев
   */
  _renderCommentedFilms() {
    for (let i = 0; i < FILM_RATED_COUNT; i++) {
      this._renderCard(this._filmsCommented()[i], this._topCommentedFilmList);
    }
  }

  /**
   * Приватный метод получения данных фильмов, отсортированных по рейтингу
   */
  _filmsRated() {
    return this._films.slice().sort(compareValues('rating', 'desc')).slice(0, FILM_RATED_COUNT);
  }

  /**
   * Приватный метод получения данных фильмов, отсортированных по количеству комментариев
   */
  _filmsCommented() {
    return this._films.slice().sort(compareValues('comments', 'desc')).slice(0, FILM_RATED_COUNT);
  }


  /**
   * Приватный метод обработки фильма (клик по интерфейсу карточки)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);

    //Обновление меню можно реализовывать здесь
  }

  /**
   * Приватный метод обработки открытия попапа (клик по интерфейсу карточки фильма)
   * @param {object} film - данные о фильме, которые необходимо отрисовать в попапе
   */
  _handlePopupDisplay(film) {
    this._popupPresenter.init(film);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу попапа)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handlePopupChange(updatedFilm, posScroll) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
    document.querySelector(`.film-details`).scrollTop = posScroll;
  }

  /**
   * Приватный метод, описывающий работу кнопки ShowMore
   * Передается аргументом в методе _renderLoadMore
   */
  _handleLoadMoreButtonClick() {
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + FILM_PER_PAGE);
    this._renderedFilmsCount += FILM_PER_PAGE;

    if (this._renderedFilmsCount >= this._films.length) {
      this._loadMoreView.getElement().remove();
      this._loadMoreView.removeElement();
      this._renderedFilmsCount = FILM_PER_PAGE;
    }
  }

  /**
   * Приватный метод, описывающий клик по панели фильтрации
   * @param {Object} evt - объект событий
   */
  _handleFilterItemClick(evt) {
    this._sortType.filter = evt.target.dataset.sort;
    this._menuComponent.getActiveMenuLink().classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this.update();
  }

  /**
   * Приватный метод, описывающий клик по панели сортировки
   * @param {Object} evt - объект событий
   */
  _handleSortItemClick(evt) {
    this._sortPanelView.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    this._sortType.sort = evt.target.dataset.sort;
    this.update();
  }

  _handlePopupRemoveComment(updatedFilm, posScroll) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
    document.querySelector(`.film-details`).scrollTop = posScroll;
  }

  _handleAddComment(updatedFilm, posScroll) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
    document.querySelector(`.film-details`).scrollTop = posScroll;
  }
}
