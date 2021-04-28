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
    this._popup = null;
  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    this._popup = new PopupView(this._film);
    this._renderPopup();
  }

  _renderPopup() {
    render(this._container, this._popup.getElement(), RenderPosition.BEFOREEND);
    const commentsList = new CommentsView(this._film.comments);
    render(this._popup.getСommentsContainer(), commentsList.getElement(), RenderPosition.BEFOREEND);
    this._container.classList.add('hide-overflow');
    this._popup.setClickHandler(() => this.close());
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.close();
      }
    });
  }

  close() {
    this._popup.getElement().remove();
    this._popup.removeElement();
    this._container.classList.remove('hide-overflow');
  }
}
