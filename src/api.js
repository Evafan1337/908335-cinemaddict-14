import Films from './model/films';
import CommentsModel from './model/comments';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

/**
 * Класс описывает методы взаимодействия с сервером
 * Для получения фильмов, комментариев
 */
export default class Api {

  /**
   * Конструктор
   * @param {string} endPoint - url для доступа
   * @param {string} authorization - токен для авторизации
   * @constructor
   */
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Метод получения данных о фильмах с сервера
   * Данные получаются и преобразовываются
   * @return {Array} - массив данных о фильмах
   */
  getFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(Films.adaptToClient));
  }

  /**
   * Метод получения комментариев определенного фильма
   * Данные получаются и преобразовываются
   * @param {Object} - film - фильм, для которого надо получить комментарии
   * @return {Array} - массив комментариев
   */
  getComments(film) {
    return this._load({url: 'comments/' + film.id})
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  /**
   * Метод обновления определенного фильма
   * @param {Object} - film - фильм, который надо обновить (отослать данные на сервер)
   * @return {Object} - данные о фильме (обновленные)
   */
  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(Films.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(Films.adaptToClient);
  }

  /**
   * Метод добавления комментария (отравление на сервер)
   * @param {Object} - comment - комментарий, который необходимо отправить
   * @param {Object} - film - фильм, к которому относится новый комментарий
   * @return {Object} - ответ сервера
   */
  addComment(comment, film) {
    return this._load({
      url: 'comments/' + film.id,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(CommentsModel.adaptToClientAddCommented);
  }

  /**
   * Метод добавления комментария (отравление на сервер)
   * @param {Object} - comment - комментарий, который необходимо удалить
   * @return {Object} - ответ сервера
   */
  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
  }

  /**
   * Непосредственно метод отправки данных на сервер
   * Определяются параметры (url, заголовки, тип запроса)
   * @return {Object} - ответ сервера
   */
  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  /**
   * Статический метод проверки статуса
   * Проверяется статус ответа сервера
   * @param {Object} - response - ответ сервера
   * В случае попадания статуса в предел "успешных"
   * @return {Object} - ответ сервера (response)
   * Иначе бросает ошибку
   */
  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  /**
   * Статический метод перевода ответа сервера в формат JSON
   * @param {Object} response - ответ сервера
   * @return {Object} - ответ сервера в виде JSON
   */
  static toJSON(response) {
    return response.json();
  }

  /**
   * Статический метод вывода ошибки при ее получении
   * @param {Object} err - ответ сервера
   */
  static catchError(err) {
    throw err;
  }
}
