import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {render, RenderPosition} from '../utils';

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
    this._popupComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    console.log(this._popupComponent);

    if (prevPopup) {
      console.log('prevPopup');
      prevPopup.getElement().remove();
      prevPopup.removeElement();
    }

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

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }


  close() {
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    this._container.classList.remove('hide-overflow');
  }
}
