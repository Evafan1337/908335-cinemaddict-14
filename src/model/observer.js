/**
 * Класс описывает поведение объектов
 * По паттерну "Наблюдатель"
 */
export default class Observer {

  /**
   * Конструктор
   * Объявляется хранилище колбэков
   * @constructor
   */
  constructor() {
    this._observers = [];
  }

  /**
   * Добавить новый колбэк (добавить подписку)
   * Который будет исполнятся при "уведомлении" (this._notify)
   * @param {function} observer
   */
  addObserver(observer) {
    this._observers.push(observer);
  }

  /**
   * Удалить колбэк (удалить подписку)
   * Который не будет исполнятся при this._notify
   * @param {function} observer
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  /**
   * Выполнить все колбэки (this._observers)
   * @param {Object} values - данные, которые необходимо "прокинуть" колбэкам
   */
  _notify(values, updateType) {
    console.log('_notify');
    console.log(values);
    console.log(updateType);
    this._observers.forEach((observer) => {

      console.log('start-----------------');
      console.log(observer);
      console.log('end-------------------');

      observer(values, updateType);
    });
  }
}
