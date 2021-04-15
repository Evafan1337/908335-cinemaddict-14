import {createElement} from "../utils";

/**
 * Функция создания кнопки отрисовки дополнительных фильмов
 * @return {string}
 */
const createLoadmoreTemplate = () => {
  return '<button class="films-list__show-more js-loadmore">Show more</button>';
};

/**
 * Класс описывает компонент (кнопку подгрузки фильмов)
 */
export default class Loadmore {

  /**
   * Конструктор
   */
  constructor() {
    this._element = null;
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createLoadmoreTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createLoadmoreTemplate();
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