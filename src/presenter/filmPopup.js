import PopupView from '../view/popup';
import CommentsView from '../view/comments';
import {replace, remove} from '../utils/elementActions';
import {render} from '../utils/render';
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
    this._commentsListComponent = null;
    this._addComment = addComment;
    this._changeData = changeData;
    this._posScroll = null;
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
      console.log('prevPopup');
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
    console.log('setHandlers');
    this._popupComponent.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popupComponent.setClickHandler(() => this.close());
    this._commentsListComponent.setDeleteCommentHandler((evt) => this._removeFilmComment(evt));
    this._commentsListComponent.setAddCommentEmotionHandler((evt) => this._addFilmCommentEmotion(evt));
    document.addEventListener('keydown', this._closePopupHandler);
    // document.addEventListener('keydown', (evt) => {
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     this.close();
    //   }
    // });
  }

  /**
   * Приватный метод обработчика создания комментария
   */
  _handleFormSubmit() {
    // document.addEventListener('keydown', (evt) => {
    this._popupComponent.getCommentsContainer().addEventListener('keydown', (evt) => {
      //  check later
      if ((evt.ctrlKey) && (evt.code === 'Enter')) {
        console.log('_handleFormSubmit');
        evt.preventDefault();
        this.submitFormComments();
      }
    });
  }

  /**
   * Метод обработки формы добавления комментария
   * Создание объекта комментария
   * Обновление моков
   */
  submitFormComments() {
    const posScroll = this.getPositionScroll();
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
        id: nanoid(),
        info: {
          text: text.value,
          author: '',
          emotion: currentEmotion,
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
    render(this._popupComponent.getCommentsContainer(), this._commentsListComponent);
  }

  /**
   * Приватные метод описывающий изменение попапа ( клик по чекбоксам фильма )
   * @param {Object} evt - объект событий
   */
  _clickFilmInfo(evt) {
    const type = evt.target.dataset.type;
    this._posScroll = this.getPositionScroll();
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), this._posScroll);
  }

  /**
   * Приватный метод, описывающий удаления комментария
   * @param {Object} evt - объект событий
   */
  _removeFilmComment(evt) {
    this._posScroll = this.getPositionScroll();
    const commentId = evt.target.closest('.film-details__comment').getAttribute('id');
    const commentInd = this._film.comments.findIndex((item) => item.id === commentId);
    this._film.comments.splice(commentInd, 1);
    this._deleteComment(Object.assign({}, this._film, {comments: this._film.comments}), this._posScroll);
  }

  _closePopupHandler(evt) {
    console.log('closePopup!');
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.close();
    }
  }

  /**
   * Приватный метод, описывающий выбор эмоции при создании комментария
   * @param {Object} evt - объект событий
   */
  _addFilmCommentEmotion(evt) {
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
