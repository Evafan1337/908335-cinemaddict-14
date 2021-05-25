import SmartView from './smart.js';
import dayjs from 'dayjs';
import {StatPeriodMap} from '../utils/const';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getStatsDataForPeriod = {
  [StatPeriodMap.ALL_TIME]: (films) => films,
  [StatPeriodMap.TODAY]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedData).isAfter(now.subtract(1, 'day'))),
  [StatPeriodMap.WEEK]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedData).isAfter(now.subtract(1, 'week'))),
  [StatPeriodMap.MONTH]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedData).isAfter(now.subtract(1, 'month'))),
  [StatPeriodMap.YEAR]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedData).isAfter(now.subtract(1, 'year'))),
};

/**
 * Метод получения массива данных о жанрах фильмов (подсчет)
 * @param {Object} films - данные
 * @return {Object}
 */
const getGenresStats = (films) => {
  let genresStats = {};
  genresStats = films.reduce((result, film) =>{
    film.genre.forEach((genreValue) => {
      if(!result[genreValue]) {
        result[genreValue] = 1;
      } else {
        result[genreValue]++;
      }
    });
    return result;
  }, []);

  return genresStats;
};

/**
 * Метод получения топового жанра
 * @param {Array} films - данные
 * @return {string}
 */
const getTopGenre = (films) => {
  if (films.length === 0) {
    return false;
  }
  const genresStats = getGenresStats(films);
  return Object.entries(genresStats).sort((a, b) => b[1] - a[1])[0][0];
};

/**
 * Метод получения всего просмотренного хронометража
 * @param {Array} films - данные
 * @return {object}
 */
const getTotalDuration = (films) => {
  let j = 0;
  for (let i = 0; i < films.length; i++) {
    j = j + films[i].time;
  }
  const hours = (j >= 60) ? Math.floor(j / 60) : 0;
  const minutes = j % 60;
  return {hours, minutes};
};

/**
 * Метод рендера
 * @param {object} statisticCtx - HTML элемент для отрисовки
 * @param {object} films - данные
 * @return {object}
 */
const renderChart = (statisticCtx, films) => {

  if (films.length === 0) {
    return false;
  }

  const labels = [];
  const counts = [];

  //  Заполняются именования и счетчики для диаграммы
  Object
    .entries(getGenresStats(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      labels.push(label);
      counts.push(count);
    });

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * Object.values(labels).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

/**
 * Функция создания компонента (блок статистики)
 * @param {object} userData - данные пользователя по просмотрам
 * @return {string}
 */
const createStatsTemplate = (userData) => {
  const {films, currentPeriod, userRank} = userData;
  const filmsWatchedAmount = films.length;
  const {hours, minutes} = getTotalDuration(films);
  const topGenre = getTopGenre(films);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${StatPeriodMap.ALL_TIME === currentPeriod ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${StatPeriodMap.TODAY === currentPeriod ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${StatPeriodMap.WEEK === currentPeriod ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${StatPeriodMap.MONTH === currentPeriod ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${StatPeriodMap.YEAR === currentPeriod ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsWatchedAmount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>
  `;
};

/**
 * Класс описывает блок статистики
 * @extends SmartView
 */
export default class Stats extends SmartView {

  /**
   * @constructor
   * @param {object} films - данные о фильмах
   * @param {string} currentPeriod - текущий период отображения статистики
   * @param {string} userRank - ранг пользователя
   */
  constructor(films, currentPeriod, userRank) {
    super();

    console.log(currentPeriod);

    this._films = films;
    this._currentPeriod = currentPeriod;
    this._userRank = userRank;
    this._data = {films: this._films, currentPeriod: this._currentPeriod, userRank: this._userRank};

    this._chart = null;
    this._setChart();

    this._statsPeriodChangeHandler = this._statsPeriodChangeHandler.bind(this);
    this._setInnerHandler();
  }

  /**
   * Метод получения HTML шаблона
   * Вызывает внешнюю функцию createStatsTemplate
   * @return {string} - HTML код созданного элемента
   */
  getTemplate() {
    return createStatsTemplate(this._data);
  }

  /**
   * Метод отработки слушателя (выбор периода отображения)
   * @param {Object} evt - объект событий
   */
  _statsPeriodChangeHandler(evt) {
    evt.preventDefault();
    const newStatsPeriod = evt.target.value;

    if (this._currentPeriod === newStatsPeriod) {
      return;
    }

    this._currentPeriod = newStatsPeriod;
    const filteredFilms = getStatsDataForPeriod[this._currentPeriod](this._films);

    this.updateData({films: filteredFilms, currentPeriod: this._currentPeriod});
  }

  /**
   * Метод установки обработчика
   */
  _setInnerHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._statsPeriodChangeHandler);
  }

  /**
   * Метод восстановления обработчиков
   */
  restoreHandlers() {
    this._setInnerHandler();
    this._setChart();
  }

  /**
   * Метод установки доски
   */
  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._data.films);
  }
}
