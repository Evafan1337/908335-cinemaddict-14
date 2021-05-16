import {createElement} from '../utils/dom';

/**
 * Абстрактный класс для компонентов
 * Предназначен для наследования
 * Определяется интерфейс для всех компонентов
 */
export default class Abstract {

  /**
   * Конструктор
   */
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._callback = {};
    this._element = null;
    this._data = {};
    this._clickHandler = this._clickHandler.bind(this);
  }

  /**
   * Метод получения HTML шаблона
   * Бросает ошибку, так как предназначен для переопределения
   */
  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  /**
   * Метод отработки слушателя
   * @param {Object} evt - объект событий
   */
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
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
