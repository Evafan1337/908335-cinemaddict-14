import SmartView from './smart';

/**
 * Функция создания компонента при отсутствии фильмов
 * @return {string}
 */
export const createEmptyFilmsTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`;
};

/**
 * Класс описывает компонент (пустой список фильмов)
 */
export default class EmptyFilms extends SmartView {

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createEmptyFilmsTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createEmptyFilmsTemplate();
  }

}
