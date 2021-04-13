/**
 * Функция рендера компонента
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

/**
 * Функция сравнения значений ( используется в sort())
 * @param {string} key - ключ для сортировки
 * @param {string} order - порядок
 * @return {number} - аргумент для дальнейшей сортировки
 */
export function compareValues(key, order = 'asc') {

  // 0 если хотя бы в одном из сравниваемых элементов нет нужного св-ва(key)
  return function innerSort(a, b) {
    // if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)){
      return 0;
    }

    //  Если мы работаем со строками то переводим все в верхний регистр для удобства сортировки
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}
