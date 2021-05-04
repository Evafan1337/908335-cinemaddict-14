import dayjs from 'dayjs';
import SmartView from './smart';
import {createElement, render, RenderPosition, replace} from '../utils';

/**
 * Функция создания шаблона комментария
 * @param {Object} comment - данные о комментарии
 * @return {string}
 */
const createCommentTemplate = (comment) => {
  const {info: {emotion, text, author}, date} = comment;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

/**
 * Функция создания компонента списка комментариев
 * @param {Object} comments - данные о комментарииях
 * @return {string}
 */
export const createCommentsTemplate = (comments) => {
  return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">${comments.map((comment) => createCommentTemplate(comment)).join('')}</ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>`;
};

/**
 * Класс описывает компонент (список комментариев попапа)
 */
export default class Comments extends SmartView {
  constructor(comments) {
    super();
    this._element = null;
    this._comments = comments;
    this._deleteClickComment = this._deleteClickComment.bind(this);
    this._addCommentEmotion = this._addCommentEmotion.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setDeleteCommentHandler(this._callback.removeClick);
    this.setAddCommentEmotionHandler(this._callback.addClickEmotion);
  }

  _setInnerHandlers() {
    for (let link of this.getElement().querySelectorAll(`.film-details__comment-delete`)) {
      link.addEventListener(`click`, this._deleteClickComment);
    }
    for (let inp of this.getElement().querySelectorAll(`.film-details__emoji-item`)) {
      inp.addEventListener(`change`, this._addCommentEmotion);
    }
  }

  /**
   * Метод отработки слушателя (удаление эмоции)
   * @param {Object} evt - объект событий
   */
  _deleteClickComment(evt) {
    evt.preventDefault();
    this._callback.removeClick(evt);
  }

  /**
   * Метод установки слушателя (удаление эмоции)
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setDeleteCommentHandler(callback) {
    this._callback.removeClick = callback;
    for (let link of this.getElement().querySelectorAll(`.film-details__comment-delete`)) {
      link.addEventListener(`click`, this._deleteClickComment);
    }
  }

  /**
   * Метод отработки слушателя (добавление эмоции)
   * @param {Object} evt - объект событий
   */
  _addCommentEmotion(evt) {
    evt.preventDefault();
    this._callback.addClickEmotion(evt);
  }

  renderEmotion(labelEmotion, emotion) {
    const img = createElement(createEmojiLabel(emotion));
    labelEmotion.innerHTML = ``;
    render(labelEmotion, img, RenderPosition.BEFOREEND);
  }

  /**
   * Метод установки слушателя (добавление эмоции)
   * @param {function} callback - функция, которая будет исполняться при слушателе
   */
  setAddCommentEmotionHandler(callback) {
    this._callback.addClickEmotion = callback;
    for (let inp of this.getElement().querySelectorAll('.film-details__emoji-item')) {
      inp.addEventListener('change', this._addCommentEmotion);
    }
  }
}
