/**
 * Функция получения случайного числа в промежутке
 * @param {number} a - начало промежутка
 * @param {number} b - конец промежутка
 * @return {number}
 */
export const getRandomInteger = (a = 0, b = 1) => {
  //  ceil - округление вверх
  const lower = Math.ceil(Math.min(a, b));
  //  floor - округление вниз
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Функция генерация рейтинга (рандомная генерация)
 * @param {number} a - начало промежутка
 * @param {number} b - конец промежутка
 * @return {number}
 */
export const generateRating = (a = 0, b = 1) => {
  // console.log(`generateRating`);
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1)).toFixed(1).replace(',', '.');
};

/**
 * Функция генерации информации о фильме
 * Определяет объект info и случайным образом выбирает из него один элемент
 * @return {object}
 */
export const generateInfo = () => {
  // console.log(`generateInfo`);
  const info = [
    {
      title: 'The Dance of Life',
      originTitle: 'The Great Flamarion',
      poster: 'the-dance-of-life.jpg',
    },
    {
      title: 'Sagebrush Trail',
      originTitle: 'Sagebrush Trail',
      poster: 'sagebrush-trail.jpg',
    },
    {
      title: 'The Man with the Golden Arm',
      originTitle: 'The Great Flamarion',
      poster: 'made-for-each-other.png',
    },
    {
      title: 'Santa Claus Conquers the Martians',
      originTitle: 'Santa Claus',
      poster: 'santa-claus-conquers-the-martians.jpg',
    },
    {
      title: 'Popeye the Sailor Meets Sindbad the Sailor',
      originTitle: 'Popeye the Sailor Meets Sindbad the Sailor',
      poster: 'popeye-meets-sinbad.png',
    },
  ];

  const randomIndex = getRandomInteger(0, info.length - 1);

  return info[randomIndex];
};

/**
 * Функция создания массивов (выборки из имеющегося случайным образом)
 * @param {Array} arr - входящий массив откуда надо взять данные
 * @param {number} n - количество элементов, которые надо "набрать"
 * @return {Array}
 */
export const choise = (arr, n) => {
  return new Array(n).fill(null).map(() => arr[getRandomInteger(0, arr.length - 1)]);
};

/**
 * Функция создания описания фильма (выборки из имеющейся строки подстроки случайным образом)
 * @return {string}
 */
export const generateDescription = () => {
  const sentences = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'];

  return sentences.slice(getRandomInteger(1, sentences.length - 1)).join(' ');
};

/**
 * Функция генерация времени случайным образом
 * @return {string}
 */
export const generateTime = () => {

  const randomHour = getRandomInteger(0, 3);
  const randomMinutes = getRandomInteger(0, 59);

  // return randomHour + `h ` + randomMinutes + `m`;
  return `${randomHour}h ${randomMinutes}m`;

};
