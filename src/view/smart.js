import AbstractView from './abstract';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  /**
   * Метод обновления данных
   * Меняет данные через Object.assign
   * Потом вызывает метод обновления элемента
   */
  updateData(update) {
    console.log('updateData');
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
    console.log('updateElement');
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }
}
