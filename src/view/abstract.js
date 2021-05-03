import {createElement} from '../utils';

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
  }

  /**
   * Метод обновления данных
   * Меняет данные через Object.assign
   * Потом вызывает метод обновления элемента
   */
  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    this.updateElement();
  }

  /**
   * Метод обновления элемента
   * работает с помощью replaceChild
   */
  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
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
