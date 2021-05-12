import FilmsPresenter from './films';
import {compareValues} from '../utils/sort';

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
  constructor(filmsContainer) {
    super();
    this._filmsContainer = filmsContainer;
    this._mainFilmList = siteBody.querySelector('.js-film-list-commented');
  }

  /**
   * Публичный метод инициализации
   * @param {Array} films - данные о фильмах
   */
  init(films) {
    this._films = films.slice().sort(compareValues('comments', 'desc')).slice(0, FILM_PER_PAGE);
    this._renderFilmList();
  }

  /**
   * Приватный метод рендера определенного количества фильмов
   * @param {number} from - индекс с какого необходимо начать отрисовку
   * @param {number} to - индекс до какого элемента необходимо произвести отрисовку
   */
  _renderFilmList() {
    this._films
      .slice()
      .forEach((film) => this._renderCard(film, this._mainFilmList));
  }

}
