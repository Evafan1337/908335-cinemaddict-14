import {createElement} from '../utils';

/**
 * Функция создания компонента списка фильмов
 * @return {string}
 */
const createFilmListTemplate = () => {
  return `<section class="films">
    <section class="films-list js-films-container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container js-film-list-main">
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container js-film-list-rated">
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container js-film-list-commented">
      </div>
    </section>
  </section>`;
};

/**
 * Класс описывает компонент (контейнер для отрисовки в них фильмов)
 */
export default class FilmList {

  /**
   * Конструктор
   */
  constructor() {
    this._element = null;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createFilmListTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createFilmListTemplate();
  }

  /**
   * Метод получения поля this._element
   * Если это поле не существует то вызывается утилитарная функция createElement
   * Аргументом которой является рез-т метода this.getTemplate()
   * @return {Object} this._element - созданный DOM элемент с заполненной информацией из карточки фильма
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Метод удаления элемента
   */
  removeElement() {
    this._element = null;
  }
}
