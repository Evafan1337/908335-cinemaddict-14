import {nanoid} from 'nanoid';
import {generateComments} from './comments';
import {getRandomInteger} from './utils';
import {generateRating} from './utils';
import {generateInfo} from './utils';
import {choise} from './utils';
import {generateDescription} from './utils';
import {generateTime} from './utils';
import {generateRandomComments} from './utils';


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
