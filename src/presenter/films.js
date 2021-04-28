import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import {
  render,
  compareValues
} from '../utils';
import FilmCardPresenter from './filmCard';

const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

/**
 * Класс описывает презентер списка фильмов
 */
export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._films = null;
    this._filmList = new FilmListView();
    this._loadMore = new LoadmoreView();
    this._mainFilmList = this._filmList.getElement().querySelector('.js-film-list-main');
    this._loadMoreContainer = this._filmList.getElement().querySelector('.js-films-container');
    this._topRatedFilmList = this._filmList.getElement().querySelector('.js-film-list-rated');
    this._topCommentedFilmList = this._filmList.getElement().querySelector('.js-film-list-commented');
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }


  /**
   * Публичный метод инициализации
   */
  init(films) {
    this._films = films;
    this._renderFilmsContainer();
  }

  /**
   * Приватный метод рендера контейнера фильмов
   * Вызывает методы рендера фильмов (в т.ч в категориях: по рейтингу и кол-ву комментариев)
   */
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmList);
    this._renderFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }

  /**
   * Приватный метод рендера определенной карточки фильма
   * Вызывает метод инициализации презентера карточки фильма (FilmCardPresenter)
   */
  _renderCard(film, container) {
    const filmCardPresenter = new FilmCardPresenter(container);
    filmCardPresenter.init(film);
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
    render(this._loadMoreContainer, this._loadMore);
    this._loadMore.setClickHandler(this._handleLoadMoreButtonClick);
  }

  /**
   * Приватный метод, описывающий работу кнопки ShowMore
   * Передается аргументом в методе _renderLoadMore
   */
  _handleLoadMoreButtonClick() {
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + FILM_PER_PAGE);
    this._renderedFilmsCount += FILM_PER_PAGE;

    if (this._renderedFilmsCount >= this._films.length) {
      this._loadMore.getElement().remove();
      this._loadMore.removeElement();
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


  //  check later
  filteredFilms(param) {
    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
    if (param !== 'default') {
      let filteredFilms = this._films.slice().sort(compareValues(param, 'desc'));
    }
  }
}
