import AbstractView from './abstract';

/**
 * Смарт класс, наследуется от абстрактного
 * Смарт класс инкапсулирует в себе бизнес-логику
 * для обновления данных и перерисовки самого себя
 * без привлечения методов презентера (модели)
 * @extends AbstractView
 */
export default class Smart extends AbstractView {

  /**
   * @constructor
   */
  constructor() {
    super();
    this._data = {};
  }

  /**
   * Метод обновления данных
   * Меняет данные через Object.assign
   * Потом вызывает метод обновления элемента
   * @param {object} update - поле которое необходимо "инвертировать"
   * По сути реализуется изменение полей карточки фильма/попапа
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
   * Путем замены элементов
   * работает с помощью replaceChild
   * Вызывает метод восстановления слушателей
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
   * Показать элемент
   */
  show() {
    this.getElement().classList.remove('visually-hidden');
  }

  /**
   * Скрыть элемент
   */
  hide() {
    this.getElement().classList.add('visually-hidden');
  }
}
