import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SiteMenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import {
  render,
  compareValues,
  RenderPosition
} from '../utils';
import FilmCardPresenter from './filmCard';

const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

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
    this._sort = null;
    this._menuView = null;
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
  }


  /**
   * Публичный метод инициализации
   */
  init(films, sortInfo) {
    console.log(sortInfo);
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._sort = sortInfo;
    this._menuView = new SiteMenuView(this._sort);
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

  update() {
    this._films = films;
    this._mainFilmList.innerHTML = ``;
    this._renderFilms();
  }

  _renderMenu() {
    console.log('_renderMenu');
    console.log(this._menuView);
    render(this._filmsContainer, this._menuView, RenderPosition.AFTERBEGIN);
    this._menuView.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  _handleFilterItemClick(evt) {
    //  dataset
    let param = evt.target.getAttribute(`data-sort`);
    this._menuView.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this._filteredFilms(param);
  }

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   */
  _renderCard(film, container) {
    const filmCardPresenter = new FilmCardPresenter(container);
    filmCardPresenter.init(film);
  }

  _handleSortItemClick(evt) {
    //  dataset str 95
    this._sortPanelView.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    let param = evt.target.getAttribute(`data-sort`);
    this._sortedFilms(param);
  }

  _renderSort() {
    render(this._filmsContainer, this._sortPanelView, RenderPosition.AFTERBEGIN);
    this._sortPanelView.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  // check later
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


  _sortedFilms(param) {
    let sorted;
    if (param !== `default`) {
      sorted = this._sourcedFilms.slice().sort(compareValues(param, `desc`));
    } else {
      sorted = this._sourcedFilms;
    }
    this.update(sorted);
  }

  _filteredFilms(param) {
    let filtered;
    if (param !== `all`) {
      filtered = this._sourcedFilms.slice().filter((film) => film[param] === true);
    } else {
      filtered = this._sourcedFilms;
    }
    this.update(filtered);
  }
}
