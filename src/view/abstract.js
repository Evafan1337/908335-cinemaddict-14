import {createElement} from "../utils";

export default class Abstract {

  /**
   * Конструктор
   */
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._element = null;
  }
  
  /**
   * Метод получения HTML шаблона
   * Бросает ошибку, так как предназначен для переопределения
   */
  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
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