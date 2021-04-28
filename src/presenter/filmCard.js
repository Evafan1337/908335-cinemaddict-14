import {render} from '../utils';
import FilmCardView from '../view/film-card';

const siteBody = document.querySelector('body');

export default class FilmCardPresenter {

  /**
   * Конструктор презентера
   * @param {Object} filmContainer - ссылка на HTML элемент куда надо отрисовать карточку фильма
   */
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._card = null;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    this._card = new FilmCardView(this._film);
    this._renderCard();
  }

  /**
   * Метод рендера карточки фильма
   */
  _renderCard() {
    render(this._filmContainer, this._card);
    this._card.setClickHandler(() => this._showPopup());
  }

  /**
   * Метод рендера карточки фильма
   */
  _showPopup() {
  }
}
