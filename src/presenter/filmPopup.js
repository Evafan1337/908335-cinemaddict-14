import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {render, RenderPosition, remove, replace} from '../utils';

export default class FilmPopupPresenter {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   */
  constructor(container, changeData) {
    this._container = container;
    this._film = null;
    this._popupComponent = null;
    this._changeData = changeData;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    const prevPopup = this._popupComponent;
    this._popupComponent = new PopupView(this._film);

    if (prevPopup && this._container.classList.contains(`hide-overflow`)) {
      replace(this._popupComponent, prevPopup);
      this._container.classList.add(`hide-overflow`);
      this._callbacks();
      this._renderComments();
      this._popupComponent.restoreHandlers();
    } else {
      this._renderPopup();
      return;
    }

    remove(prevPopup);
  }

  _renderPopup() {
    render(this._container, this._popupComponent);
    this._container.classList.add(`hide-overflow`);
    this._callbacks();
    this._renderComments();
  }

  _callbacks() {
    this._popupComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popupComponent.setClickHandler(() => this.close());
    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        this.close();
      }
    });
  }

  _renderComments() {
    const commentsComponent = new CommentsView(this._film.comments);
    render(this._popupComponent.getCommentsContainer(), commentsComponent);
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

  close() {
    remove(this._popupComponent);
    this._container.classList.remove(`hide-overflow`);
  }
}
