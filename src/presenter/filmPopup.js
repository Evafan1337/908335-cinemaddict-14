import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {
  render,
  replace,
  remove,
  RenderPosition
} from '../utils';
import {nanoid} from 'nanoid';

export default class FilmPopupPresenter {

  /**
   * Конструктор попапа
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   * @param {Function} changeData - функция изменения данных
   */
  constructor(container, changeData, deleteComment, addComment) {
    this._container = container;
    this._film = null;
    this._popupComponent = null;
    this._deleteComment = deleteComment;
    this._commentsListComponent = {};
    this._addComment = addComment;
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
    this._commentsListComponent = new CommentsView(this._film.comments);

    if (prevPopup && this._container.classList.contains('hide-overflow')) {
      replace(this._popupComponent, prevPopup);
      this._container.classList.add('hide-overflow');
      this._callbacks();
      this._renderComments();
      this._popupComponent.restoreHandlers();
      this._commentsListComponent.restoreHandlers();
    } else {
      this._renderPopup();
      return;
    }

    remove(prevPopup);
  }

  /**
   * Приватный метод рендера попапа
   */
  _renderPopup() {
    render(this._container, this._popupComponent);
    this._container.classList.add('hide-overflow');
    this._callbacks();
    this._renderComments();
  }

  /**
   * Приватный метод определения колбэков
   */
  _callbacks() {
    this._popupComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popupComponent.setClickHandler(() => this.close());
    this._commentsListComponent.setDeleteCommentHandler((evt) => this._removeFilmComment(evt));
    this._commentsListComponent.setAddCommentEmotionHandler((evt) => this._addFilmCommentEmotion(evt));
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.close();
      }
    });
    document.addEventListener('keydown', (evt) => {
      //  check later
      if ((evt.ctrlKey) && ((evt.keyCode === 0xA) || (evt.keyCode === 0xD))) {
        evt.preventDefault();
        this.submitFormComments();
      }
    });
  }

  submitFormComments() {
    let posScroll = this.getPositionScroll();
    let text = this._popupComponent.getElement().querySelector('.film-details__comment-input');
    const emotions = document.querySelectorAll('.film-details__emoji-item');
    let currentEmotion;
    for (let emotion of emotions) {
      if (emotion.checked) {
        currentEmotion = emotion.value;
      }
    }
    if (currentEmotion !== null && (text !== `` || text !== null)) {
      let newComment = {
        id: nanoid(),
        info: {
          text: text.value,
          author: ``,
          emotion: currentEmotion
        },
        date: new Date(),
      };
      this._film.comments.push(newComment);
      this._addComment(Object.assign({}, this._film, {comments: this._film.comments}), posScroll);
    }
  }

  /**
   * Приватный метод рендера комментариев
   */
  _renderComments() {
    render(this._popupComponent.getCommentsContainer(), this._commentsListComponent, RenderPosition.BEFOREEND);
  }

  /**
   * Метод инициализации
   * @param {Object} evt - объект событий
   */
  _clickFilmInfo(evt) {
    const type = evt.target.dataset.type;
    let posScroll = this.getPositionScroll();
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), posScroll);
  }

  _removeFilmComment(evt) {
    let posScroll = this.getPositionScroll();
    let commentId = evt.target.closest('.film-details__comment').getAttribute('id');
    let commentInd = this._film.comments.findIndex((item) => item.id === commentId);
    this._film.comments.splice(commentInd, 1);
    this._deleteComment(Object.assign({}, this._film, {comments: this._film.comments}), posScroll);
  }

  _addFilmCommentEmotion(evt) {
    console.log('_addFilmCommentEmotion');
    const labelEmotion = this._commentsListComponent.getElement().querySelector('.film-details__add-emoji-label');
    const emotion = evt.target.value;
    this._commentsListComponent.renderEmotion(labelEmotion, emotion);
  }

  getPositionScroll() {
    return document.querySelector('.film-details').scrollTop;
  }

  /**
   * Закрытие попапа
   */
  close() {
    remove(this._popupComponent);
    this._container.classList.remove('hide-overflow');
  }
}
