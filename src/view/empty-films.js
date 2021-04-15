import {createElement} from "../utils";

/**
 * Функция создания компонента при отсутствии фильмов
 * @return {string}
 */
export const createEmptyFilms = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

/**
 * Класс описывает компонент (пустой список фильмов)
 */
export default class EmptyFilms {

  /**
   * Конструктор
   */
  constructor() {
    this._element = null;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createEmptyFilmsTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createEmptyFilmsTemplate();
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