export const StatPeriodMap = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const FilmsPerSection = {
  MAIN: 5,
  COMMENTED: 2,
  RATED: 2,
};

/**
 * Метод выборки звания пользователя
 * В зависимости от количества просмотренных фильмов
 * @param {number} count - количество просмотренных фильмов
 */
export const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserRank.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BAFF;
  }
};

export const FILM_RATED_COUNT = 2;
