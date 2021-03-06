import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {replace, remove} from '../utils/dom';
import {UpdateType, UserAction} from '../utils/const';
import {render} from '../utils/render';
import he from 'he';

export default class FilmPopupPresenter {

  /**
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   * @param {Function} changeData - функция изменения данных
   * @constructor
   */
  constructor(container, changeData, deleteComment, addComment, commentsModel, filterModel) {
    this._container = container;

    this._film = null;
    this._comments = [];

    this._commentsModel = commentsModel;
    this._commentsModel.addObserver(this.observeComments.bind(this));
    this._filterModel = filterModel;

    this._popupComponent = null;
    this._commentsListComponent = null;

    this._deleteComment = deleteComment;
    this._addComment = addComment;
    this._changeData = changeData;

    this._posScroll = null;

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._handleFormSubmit =this._handleFormSubmit.bind(this);

  }

  /**
   * Метод инициализации
   * @param {Object} film - данные о фильме
   */
  init(film) {
    this._film = film;
    this._comments = this._commentsModel.getCommentsFilm();
    this._commentsListComponent = new CommentsView(this._comments);
    const prevPopup = this._popupComponent;
    this._popupComponent = new PopupView(this._film);
    if (prevPopup && this._container.classList.contains('hide-overflow')) {
      replace(this._popupComponent, prevPopup);
      this._container.classList.add('hide-overflow');
      this.setHandlers();
      this._renderComments();
      document.querySelector('.film-details').scrollTop = this._posScroll;
    } else {
      this._renderPopup();
      return;
    }

    remove(prevPopup);
  }

  observeComments(updateType, commentsData, film, userAction, transferResult) {

    if(updateType === UpdateType.INIT) {
      this.init(film, commentsData);
      return;
    }

    if (!transferResult) {
      switch (userAction) {
        case UserAction.ADD_COMMENT:
          this._setCommentsFormShake();
          break;
        case UserAction.DELETE_COMMENT:
          this._setCommentHtmlNodeShake(commentsData);
          break;
      }
      return;
    }

    this.init(film, commentsData);
  }

  _setCommentsFormShake() {
    this._commentsListComponent.setFormShaking();
    setTimeout(this._commentsListComponent.removeFormShaking, 1000);
  }

  _setCommentHtmlNodeShake(commentToShake) {
    setTimeout(this._commentsListComponent.setOriginalButtonText, 1000, commentToShake.id);
    setTimeout(this._commentsListComponent.setCommentShaking, 1000, commentToShake);
    setTimeout(this._commentsListComponent.removeCommentShaking, 3000, commentToShake);
  }

  /**
   * Приватный метод рендера попапа
   */
  _renderPopup() {
    render(this._container, this._popupComponent);
    this._container.classList.add('hide-overflow');
    this.setHandlers();
    this._renderComments();
  }

  /**
   * Приватный метод определения колбэков
   */
  setHandlers() {
    this._popupComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popupComponent.setClickHandler(() => this.close());
    this._commentsListComponent.setDeleteCommentHandler((evt) => this._removeComment(evt));
    this._commentsListComponent.setAddCommentEmotionHandler((evt) => this._addCommentEmotion(evt));
    document.addEventListener('keydown', this._closePopupHandler);
    document.addEventListener('keydown', this._handleFormSubmit);
  }

  /**
   * Метод обработки формы добавления комментария
   * Создание объекта комментария
   * Обновление исходных данных
   */
  submitFormComments() {
    this._posScroll = this.getPositionScroll();
    const text = this._popupComponent.getElement().querySelector('.film-details__comment-input');
    const emotions = document.querySelectorAll('.film-details__emoji-item');
    let currentEmotion;

    for (const emotion of emotions) {
      if (emotion.checked) {
        currentEmotion = emotion.value;
      }
    }
    if (currentEmotion !== null && text) {
      const newComment = {
        info: {
          text: he.encode(text.value),
          author: '',
          emotion: currentEmotion,
        },
        date: new Date(),
      };
      this._addComment(this._film, newComment, UpdateType.PATCH, UserAction.ADD_COMMENT);
    }
  }

  getPopupComponent(){
    return this._popupComponent;
  }

  getCommentsComponent() {
    return this._commentsListComponent;
  }

  /**
   * Приватный метод рендера комментариев
   */
  _renderComments() {
    render(this._popupComponent.getCommentsContainer(), this._commentsListComponent);
  }

  /**
   * Приватные метод описывающий изменение попапа ( клик по чекбоксам фильма )
   * @param {Object} evt - объект событий
   */
  _clickFilmInfo(evt) {
    const type = evt.target.dataset.type;
    this._posScroll = this.getPositionScroll();

    let updateType = UpdateType.PATCH;
    if(this._filterModel.getFilterBy() === type) {
      updateType = UpdateType.MAJOR;
    }
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), updateType);
  }

  /**
   * Приватный метод, описывающий удаления комментария
   * @param {Object} evt - объект событий
   */
  _removeComment(evt) {
    this._posScroll = this.getPositionScroll();

    const commentId = evt.target.closest('.film-details__comment').dataset.id;
    const commentInd = this._comments.findIndex((item) => item.id === commentId);
    const filmsCommentInd = this._film.comments.findIndex((item) => item.id === commentId);

    this._commentsListComponent.changeDeleteButtonText(commentId);

    this._film.comments.splice(filmsCommentInd, 1);
    this._deleteComment(Object.assign({}, this._film, {comments: this._film.comments}), this._comments[commentInd], UpdateType.PATCH, UserAction.DELETE_COMMENT);
  }

  /**
   * Приватный метод, описывающий закрытие попапа
   * @param {Object} evt - объект событий
   */
  _closePopupHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.close();
    }
  }

  /**
   * Приватный метод обработчика создания комментария
   */
  _handleFormSubmit(evt) {
    if ((evt.metaKey || evt.ctrlKey) && (evt.code === 'Enter')) {
      evt.preventDefault();
      this.submitFormComments();
    }
  }

  /**
   * Приватный метод, описывающий выбор эмоции при создании комментария
   * @param {Object} evt - объект событий
   */
  _addCommentEmotion(evt) {
    this._posScroll = this.getPositionScroll();
    const labelEmotion = this._commentsListComponent.getElement().querySelector('.film-details__add-emoji-label');
    const emotion = evt.target.value;
    this._commentsListComponent.renderEmotion(labelEmotion, emotion);
  }

  /**
   * Метод получения кол-ва прокрученных пикселей
   */
  getPositionScroll() {
    return document.querySelector('.film-details').scrollTop;
  }

  /**
   * Закрытие попапа
   */
  close() {
    remove(this._popupComponent);
    this._container.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._closePopupHandler);
    document.removeEventListener('keydown', this._handleFormSubmit);
  }

}
