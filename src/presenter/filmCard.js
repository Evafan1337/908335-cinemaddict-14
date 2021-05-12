import {replace, remove} from '../utils/elementActions';
import {render} from '../utils/render';
import FilmCardView from '../view/film-card';

export default class FilmCardPresenter {

  /**
   * Конструктор презентера
   * @param {Object} filmContainer - ссылка на HTML элемент куда надо отрисовать карточку фильма
   * @param {Function} changeData - функция изменения данных
   * @param {Function} showPopup - функция открытия попапа
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
    //  Устанавливаем слушатели на открытие попапа и редактирование данных
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
