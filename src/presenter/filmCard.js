import {render, replace, remove} from '../utils';
import FilmCardView from '../view/film-card';
import FilmPopupPresenter from './filmPopup';

const siteBody = document.querySelector('body');

export default class FilmCardPresenter {

  /**
   * Конструктор презентера
   * @param {Object} filmContainer - ссылка на HTML элемент куда надо отрисовать карточку фильма
   */
  constructor(filmContainer, changeData, showPopup) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._cardComponent = null;
    this._changeData = changeData;
    this._showPopup = showPopup;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    const prevCard = this._cardComponent;
    this._cardComponent = new FilmCardView(this._film);
    this._cardComponent.setClickHandler(() => this._showPopup(this._film));
    this._cardComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));

    if (prevCard) {
      replace(this._cardComponent, prevCard);
      // remove(prevCard);
    } else {
      this._renderCard();
    }
  }

  /**
   * Метод рендера карточки фильма
   */
  _renderCard() {
    render(this._filmContainer, this._cardComponent);
  }


  /**
   * Метод обработки клика по карточке фильма (управление данными)
   * @param {Object} evt - объект событий
   */
  _clickFilmInfo(evt) {
    console.log('filmCard.js: _clickFilmInfo');
    let type = evt.target.dataset.type;
    console.log(type);

    //  Инвертируем значение в сыром виде данных о фильме согласно клика
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

}
