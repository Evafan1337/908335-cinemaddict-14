import {replace, remove} from '../utils/dom';
import {render} from '../utils/render';
import FilmCardView from '../view/film-card';

/**
 * Класс описывает презентер карточки фильма
 */
export default class FilmCardPresenter {

  /**
   * @param {Object} filmContainer - ссылка на HTML элемент куда надо отрисовать карточку фильма
   * @param {Function} changeData - функция изменения данных
   * @param {Function} showPopup - функция открытия попапа
   * @constructor
   */
  constructor(filmContainer, changeData, showPopup) {
    //  Ссылки на DOM узлы
    this._filmContainer = filmContainer;

    //  Данные
    this._film = null;

    //  Компоненты
    this._cardComponent = null;

    //  Функции
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
    } else {
      this._renderCard();
      return;
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
    const type = evt.target.dataset.type;
    //  Инвертируем значение в сыром виде данных о фильме согласно клика
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

  /**
   * Метод удаления компонента
   */
  destroy() {
    remove(this._cardComponent);
  }
}
