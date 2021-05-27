// import AbstractView from './abstract';
import SmartView from './smart';
import {profileRating} from '../utils/const';

/**
 * Функция создания шаблона звания пользователя
 * В зависимости от количества просмотренных фильмов
 * @param {number} count - количество просмотренных фильмов
 * @return {string} - HTML отображение
 */
const createProfileTemplate = (count) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${ profileRating(count) }</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

/**
 * Класс описывает компонент "звания пользователя"
 * @extends AbstractView
 */
export default class Profile extends SmartView {

  /**
   * @constructor
   * @param {number} count - количество просмотренных фильмов (счетчик)
   */
  constructor(count) {
    super();
    this._count = count;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createProfileTemplate с аргументом this._count
   * Поле которого обьявляется в конструкторе
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
