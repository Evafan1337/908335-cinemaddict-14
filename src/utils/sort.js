import FILM_RATED_COUNT from './const';

/**
 * Функция сравнения значений ( используется в sort())
 * @param {string} key - ключ для сортировки
 * @param {string} order - порядок
 * @return {number} - аргумент для дальнейшей сортировки
 */
export const compareValues = (key, order = 'asc') => {

  // 0 если хотя бы в одном из сравниваемых элементов нет нужного св-ва(key)
  return (a, b) => {
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
};

/**
 * Функция фильтрации фильмов (по наличию чекбоксов)
 * @param {Array} filmsData - массив фильмов
 * @return {Object} filmsInfo
 */
export const filmsInfoSort = (filmsData) => {
  const fieldList = ['isFavorite', 'isViewed', 'isWatchlist'];
  const filmsInfo = filmsData.reduce((filmsDataResult, film) => {
    //  Непосредственно перебор карточки фильма
    for (const filmDataField in film) {
      if (fieldList.indexOf(filmDataField) != -1) {

        if(!filmsDataResult[filmDataField]) {
          filmsDataResult[filmDataField] = [];
        }

        if(film[filmDataField]) {
          filmsDataResult[filmDataField].push(film);
        }
      }
    }
    return filmsDataResult;
  }, []);

  return filmsInfo;
};

export const getFilmsInfoSortLength = (filmsData) => {

  if(!filmsData.isFavorite && !filmsData.isViewed && !filmsData.isWatchlist){
    return {
      isFavorite: 0,
      isViewed: 0,
      isWatchlist: 0,
    };
  }

  return {
    isFavorite: filmsData.isFavorite.length,
    isViewed: filmsData.isViewed.length,
    isWatchlist: filmsData.isWatchlist.length,
  };
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
