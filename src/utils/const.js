export const StatPeriodMap = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserRank.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BAFF;
  }
};