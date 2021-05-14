import AbstractView from './abstract';

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

/**
 * Метод выборки звания пользователя
 * В зависимости от количества просмотренных фильмов
 * @param {number} count - количество просмотренных фильмов
 */
const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserRank.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BUFF;
  }
};

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
 */
export default class Profile extends AbstractView {
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
