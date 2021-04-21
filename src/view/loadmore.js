import AbstractView from './abstract';

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
export default class Loadmore extends AbstractView {

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createLoadmoreTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createLoadmoreTemplate();
  }
}
