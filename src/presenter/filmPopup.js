import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {render, RenderPosition} from '../utils';

export default class FilmPopupPresenter {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   */
  constructor(container) {
    this._container = container;
    this._film = null;
    this._popupComponent = null;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    this._popupComponent = new PopupView(this._film);
    console.log(this._popupComponent);
    this._renderPopup();
  }

  _renderPopup() {
    render(this._container, this._popupComponent);
    const commentsList = new CommentsView(this._film.comments);

    // console.log(this._popupComponent.getCommentsContainer());

    render(this._popupComponent.getCommentsContainer(), commentsList);
    this._container.classList.add('hide-overflow');
    this._popupComponent.setClickHandler(() => this.close());
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.close();
      }
    });
  }

  close() {
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    this._container.classList.remove('hide-overflow');
  }
}
