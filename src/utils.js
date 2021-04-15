const FILM_RATED_COUNT = 2;

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

/**
 * Функция рендера компонента
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

/**
 * Функция рендера шаблона
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

/**
 * Функция создания HTML элемента
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {Object} newElement.firstChild - созданный HTML элемент
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`); // 1
  newElement.innerHTML = template;

  return newElement.firstChild;
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

/**
 * Функция фильтрации фильмов (по наличию чекбоксов)
 * @param {Array} filmsData - массив фильмов
 * @return {Object} filmsInfo
 */
export const filmsInfoSort = (filmsData) => {
  const fieldList = ['isFavorite', 'isViewed', 'isWatchlist'];
  const filmsInfo = filmsData.reduce((acc, film) => {
    //  Непосредственно перебор карточки фильма
    for (const filmDataField in film) {
      if (fieldList.indexOf(filmDataField) != -1) {

        if(!acc[filmDataField]) {
          acc[filmDataField] = [];
        }

        if(film[filmDataField]) {
          acc[filmDataField].push(film);
        }
      }
    }
    return acc;
  }, []);

  return filmsInfo;
};

/**
 * Функция сортировки фильмов по рейтингу
 * @param {Array} filmsData - массив фильмов
 * @return {Array} filmsData - массив фильмов
 */
export const sortFilmsRated = (filmsData) => {
  return filmsData.sort(compareValues('rating', 'desc')).slice(0, FILM_RATED_COUNT);
};

/**
 * Функция сортировки фильмов по количеству комментариев
 * @param {Array} filmsData - массив фильмов
 * @return {Array} filmsData - отсортированный массив
 */
export const sortFilmsCommented = (filmsData) => {
  return filmsData.sort(compareValues('comments', 'desc')).slice(0, FILM_RATED_COUNT);
};