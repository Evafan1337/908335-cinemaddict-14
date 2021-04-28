import {render} from '../utils';
import FilmCardView from '../view/film-card';
import FilmPopupPresenter from './filmPopup';

const siteBody = document.querySelector('body');

export default class FilmCardPresenter {

  /**
   * Конструктор презентера
   * @param {Object} filmContainer - ссылка на HTML элемент куда надо отрисовать карточку фильма
   */
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._cardComponent = null;
    this._popupPresenter = new FilmPopupPresenter(siteBody);
    this._changeData = changeData;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    const prevCard = this._cardComponent;
    this._cardComponent = new FilmCardView(this._film);
    this._card.setClickHandler(() => this._showPopup());
    this._card.setEditClickHandler((evt) => this._clickFilmInfo(evt));

    if (prevCard === null) {
      this._renderCard();
      return;
    }

    prevCard.getElement().remove();
    prevCard.removeElement();
    // this._renderCard();
  }

  /**
   * Метод рендера карточки фильма
   */
  _renderCard() {
    render(this._filmContainer, this._cardComponent);
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    // check
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

  /**
   * Метод рендера карточки фильма
   */
  _showPopup() {
    this._popupPresenter.init(this._film);
  }

  _changeData() {
    console.log(this._film);
  }
}
