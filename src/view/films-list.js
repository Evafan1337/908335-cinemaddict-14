import AbstractView from './abstract';

/**
 * Функция создания компонента списка фильмов
 * @return {string}
 */
const createFilmListTemplate = () => {
  return `<section class="films">
    <section class="films-list js-films-container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container js-film-list-main">
      </div>
    </section>
  </section>`;
};

/**
 * Класс описывает компонент (контейнер для отрисовки в них фильмов)
 */
export default class FilmList extends AbstractView {

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createFilmListTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createFilmListTemplate();
  }
}
