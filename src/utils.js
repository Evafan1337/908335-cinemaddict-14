/**
 * Функция рендера компонента
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
