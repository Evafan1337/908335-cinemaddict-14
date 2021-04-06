import {nanoid} from 'nanoid';
import {generateComments} from "./comments";
import {getRandomInteger} from "./random";

/**
 * Функция генерация рейтинга (рандомная генерация)
 * @param {number} a - начало промежутка
 * @param {number} b - конец промежутка
 * @return {number}
 */
const generateRating = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1)).toFixed(1).replace(`,`, `.`);
};

/**
 * Функция генерации информации о фильме
 * Определяет объект info и случайным образом выбирает из него один элемент
 * @return {object}
 */
const generateInfo = () => {
  const info = [
    {
      title: `The Dance of Life`,
      originTitle: `The Great Flamarion`,
      poster: `the-dance-of-life.jpg`,
    },
    {
      title: `Sagebrush Trail`,
      originTitle: `Sagebrush Trail`,
      poster: `sagebrush-trail.jpg`,
    },
    {
      title: `The Man with the Golden Arm`,
      originTitle: `The Great Flamarion`,
      poster: `made-for-each-other.png`,
    },
    {
      title: `Santa Claus Conquers the Martians`,
      originTitle: `Santa Claus`,
      poster: `santa-claus-conquers-the-martians.jpg`,
    },
    {
      title: `Popeye the Sailor Meets Sindbad the Sailor`,
      originTitle: `Popeye the Sailor Meets Sindbad the Sailor`,
      poster: `popeye-meets-sinbad.png`,
    }
  ];

  const randomIndex = getRandomInteger(0, info.length - 1);

  return info[randomIndex];
};

const regisseurs = [
  `Anthony Mann`,
  `Christopher Jonathan`,
  `Steven Spielberg`,
  `Martin Scorsese`,
  `Alfred Hitchcock`,
];

const screenwriters = [
  `Билли Уайлдер`,
  `Итан и Джоэл Коэны`,
  `Роберт Таун`,
  `Квентин Тарантино`,
  `Френсис Форд Коппола`,
];

const genres = [
  `Comedy`,
  `Cartoon`,
  `Drama`,
  `Western`,
  `Musical`
];

const countries = [
  `USA`,
  `Great Britain`,
  `Canada`,
  `France`,
  `Russia`,
];

const actors = [
  `Alan Rickman`,
  `Benedict Cumberbatch`,
  `Benicio del Toro`,
  `Vincent Cassel`,
  `Viggo Mortensen`,
];

/**
 * Функция создания массивов (выборки из имеющегося случайным образом)
 * @param {Array} arr - входящий массив откуда надо взять данные
 * @param {number} n - количество элементов, которые надо "набрать"
 * @return {Array}
 */
const choise = (arr, n) => {
  return new Array(n).fill(null).map(() => arr[getRandomInteger(0, arr.length - 1)]);
};

/**
 * Функция создания описания фильма (выборки из имеющейся строки подстроки случайным образом)
 * @return {string}
 */
const generateDescription = () => {
  const sentences = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`];

  return sentences.slice(getRandomInteger(1, sentences.length - 1)).join(` `);
};

/**
 * Функция генерация времени случайным образом
 * @return {string}
 */
const generateTime = () => {

  const randomHour = getRandomInteger(0, 3);
  const randomMinutes = getRandomInteger(0, 59);

  return randomHour + `h ` + randomMinutes + `m`;
};

/**
 * Функция генерация времени (dayjs) + рандом
 * @return {string}
 */
const generateRandomComments = () => {
  const COMMENT_COUNT = getRandomInteger(0, 5);
  const randomComments = new Array(COMMENT_COUNT).fill(null).map((index) => generateComments(index));
  return randomComments;
};

/**
 * Функция создания объекта фильма
 * Поля заполняются методами из этого файла
 * @return {object}
 */
export const generateFilm = () => {
  return {
    id: nanoid(),
    info: generateInfo(),
    description: generateDescription(),
    time: generateTime(),
    date: new Date(getRandomInteger(0, new Date())),
    genre: choise(genres, getRandomInteger(1, genres.length - 1)),
    comments: generateRandomComments(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isViewed: Boolean(getRandomInteger(0, 1)),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    rating: generateRating(0, 9),
    age: getRandomInteger(0, 18),
    regisseur: choise(regisseurs, 1),
    screenwriters: choise(screenwriters, getRandomInteger(1, screenwriters.length - 1)),
    actors: choise(actors, getRandomInteger(1, actors.length - 1)),
    country: choise(countries, getRandomInteger(1, countries.length - 1)),
  };
};
