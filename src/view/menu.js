/**
 * Функция создания компонента меню
 * @param {object} filmsInfo - информация о фильме
 * @return {string}
 */
export const createMenuTemplate = (filmsInfo) => {

  const {isWatchlist, isViewed, isFavorite} = filmsInfo;

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${isWatchlist.length}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item">History <span class="main-navigation__item-count">${isViewed.length}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${isFavorite.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
