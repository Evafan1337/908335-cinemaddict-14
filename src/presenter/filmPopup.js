import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {replace, remove, updateHtmlNode} from '../utils/dom';
import {UpdateType} from '../utils/const';
import {render} from '../utils/render';
import he from 'he';

export default class FilmPopupPresenter {

  /**
   * @param {Object} container - ссылка на HTML элемент куда надо отрисовать попап
   * @param {Function} changeData - функция изменения данных
   * @constructor
   */
  constructor(container, changeData, deleteComment, addComment, commentsModel, filterModel) {
    //  Ссылки на DOM узлы
    this._container = container;

    //  Данные
    this._film = null;
    this._comments = [];

    //  Модели
    this._commentsModel = commentsModel;
    this._commentsModel.addObserver(this.observeComments.bind(this));
    this._filterModel = filterModel

    //  Компоненты
    this._popupComponent = null;
    this._commentsListComponent = null;

    //  Функции
    this._deleteComment = deleteComment;
    this._addComment = addComment;
    this._changeData = changeData;

    //  Прочее
    this._posScroll = null;

    //  Слушатели
    this._closePopupHandler = this._closePopupHandler.bind(this);

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

  observeComments(updateType, comments, film) {
    // this.init(this._film, comments);

    console.log(updateType);
    console.log(comments);
    console.log(film);

    this.init(film, comments);

    // switch (updateType) {
    //   case UpdateType.PATCH:
    //     console.log('Обновление комментариев');
    //     // let newCommentsComponent = new CommentsView(comments);
    //     // replace(newCommentsComponent, this._commentsListComponent);
    //     break;
    //   case UpdateType.INIT:
    //     this.init(film, comments);
    //     break;
    // }
  }

  /**
   * Приватный метод рендера попапа
   */
  _renderPopup() {
    render(this._container, this._popupComponent);
    this._container.classList.add('hide-overflow');
    this.setHandlers();
    this._handleFormSubmit();
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
  }

  /**
   * Приватный метод обработчика создания комментария
   */
  _handleFormSubmit() {
    // this._popupComponent.getCommentsContainer().addEventListener('keydown', (evt) => {
    document.addEventListener('keydown', (evt) => {
      if ((evt.ctrlKey) && (evt.code === 'Enter')) {
        evt.preventDefault();
        this.submitFormComments();
      }
    });
  }

  /**
   * Метод обработки формы добавления комментария
   * Создание объекта комментария
   * Обновление исходных данных
   */
  submitFormComments() {
    console.log('submitFormComments');
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
      this._addComment(this._film, newComment, UpdateType.PATCH);
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

    // if(this._commentsListComponent) {
    //   const newCommentsListComponent = this._commentsListComponent;
    //   replace(this._commentsListComponent, newCommentsListComponent);
    //   this._commentsListComponent = newCommentsListComponent;
    // } else {
    //   render(this._popupComponent.getCommentsContainer(), this._commentsListComponent);
    // }
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
      updateType = UpdateType.MAJOR
    }

    console.log(updateType);

    // this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), this._posScroll);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), updateType);
  }

  /**
   * Приватный метод, описывающий удаления комментария
   * @param {Object} evt - объект событий
   */
  _removeComment(evt) {
    this._popupComponent.changeDeleteButtonText();
    this._posScroll = this.getPositionScroll();

    const commentId = evt.target.closest('.film-details__comment').dataset.id;
    const commentInd = this._comments.findIndex((item) => item.id === commentId);
    const filmsCommentInd = this._film.comments.findIndex((item) => item.id === commentId);

    this._film.comments.splice(filmsCommentInd, 1);
    this._deleteComment(Object.assign({}, this._film, {comments: this._film.comments}), this._comments[commentInd]);
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
  }

}
