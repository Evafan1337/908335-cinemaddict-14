import {nanoid} from 'nanoid';
import FilmListView from '../view/films-list';
import LoadmoreView from '../view/loadmore';
import SiteMenuView from '../view/menu';
import SortPanelView from '../view/sort-panel';
import ProfileView from '../view/profile';
import {
  render,
  remove,
  replace,
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
    this._menuComponent = null;
    this._filmPresenter = {};
    //  Переименовать в Components
    this._sortPanelView = new SortPanelView();
    this._filmListView = new FilmListView();
    this._loadMoreView = new LoadmoreView();
    this._profileComponent = null;
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
    this._historyCount = null;
  }


  /**
   * Публичный метод инициализации
   */
  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    //взять из утилит
    this._sort = {
      isWatchlist: this._sourcedFilms.filter((item) => item.isWatchlist).length,
      isViewed: this._sourcedFilms.filter((item) => item.isViewed).length,
      isFavorite: this._sourcedFilms.filter((item) => item.isFavorite).length,
    };
    if (this._sort.history > 0) {
      this._renderProfile();
    }
    this._renderFilmsContainer();
  }

  /**
   * Приватный метод обновление наполнения списка фильмов
   */
  update(renderedFilms) {
    this._clearList();
    if (renderedFilms) {
      this._renderedFilmsCount = renderedFilms;
    }
    let updatedFilms = this._sourcedFilms;
    this._sort = {
      isWatchlist: this._sourcedFilms.filter((item) => item.isWatchlist).length,
      isViewed: this._sourcedFilms.filter((item) => item.isViewed).length,
      isFavorite: this._sourcedFilms.filter((item) => item.isFavorite).length,
    };
    if (this._sort.history > 0) {
      this._renderProfile();
    }
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
   * Приватный метод рендера контейнера фильмов
   * Вызывает методы рендера фильмов (в т.ч в категориях: по рейтингу и кол-ву комментариев)
   */
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmListView);
    this._renderSort(this._filmsContainer);
    this._renderMenu(this._filmsContainer);
    this._renderFilms();
  }

  _renderProfile() {
    const prevProfile = this._profileComponent;
    this._profileComponent = new ProfileView(this._sort.history);
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
    this._menuComponent = new SiteMenuView(this._sort, this._sortType.filter);
    if (prevMenu) {
      this._sort = {
        isWatchlist: this._films.filter((item) => item.isWatchlist).length,
        isViewed: this._films.filter((item) => item.isViewed).length,
        isFavorite: this._films.filter((item) => item.isFavorite).length,
      };
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
    // check laterf
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
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));

    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
  }

  // later
  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_PER_PAGE;
    remove(this._loadMoreView);
  }

  /**
   * Приватный метод обработки фильма (клик по интерфейсу карточки)
   * @param {object} updatedFilm - данные о фильме, которые нужно изменить
   */
  _handleFilmChange(updatedFilm) {
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._renderProfile();
    this._renderMenu(this._filmsContainer);
    // check later
    if (!updatedFilm[this._sortType.filter]) {
      this.update(this._renderedFilmsCount);
    } else {
      this._filmPresenter[updatedFilm.id].forEach((item) => {
        item.init(updatedFilm);
      });
    }
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
  _handlePopupChange(updatedFilm) {
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    if (!updatedFilm[this._sortType.filter]) {
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

    console.log(this._menuComponent.getActiveMenuLink());

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

  _handlePopupRemoveComment(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }

  _handleAddComment(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popupPresenter.init(updatedFilm);
  }
}
