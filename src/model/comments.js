import Observer from './observer';

/**
 * Класс описывает модель комментариев
 * Привязывается к модели фильма и вызывается в контексте другой модели
 * @extends Observer
 */
export default class CommentsModel extends Observer {

  /**
   * Конструктор
   * Выполняется конструктор родительского класса
   * Объявляется массив данных комментариев
   * @param {Object} api - интерфейс для общения с сервером
   * @constructor
   */
  constructor(api) {
    super();
    this._commentList = [];
    this._api = api;
  }

  /**
   * Установить комментарии для выбранного фильма (film)
   * @param {Object} film - фильм, для которого нужно установить комментарии
   */
  setCommentsFilm(film, updateType) {
    this._api.getComments(film).then((comments) => {
      this._commentList = comments.slice();
      this._notify(updateType, this._commentList, film);
    }).catch(() => {
      this._commentList = [];
      this._notify(updateType, this._commentList, film);
    });
  }

  /**
   * Получить комментарии
   */
  getCommentsFilm() {
    return this._commentList;
  }

  addComment(comment, film, updateType, userAction) {
    this._api.addComment(comment, film).then((update) => {
      this._commentList = update[1];
      this._notify(updateType, update[1], update[0], userAction, true);
    }).catch(() => {
      this._notify(updateType, undefined, undefined, userAction, false);
    });
  }

  removeComment(commentToRemove, film, updateType, userAction) {
    this._api.deleteComment(commentToRemove).then(() => {
      const index = this._commentList.findIndex((comment) => comment.id === commentToRemove.id);

      if (index === -1) {
        throw new Error('Can not update unexisting film');
      }

      this._commentList.splice(index, 1);
      this._notify(updateType, this._commentList, film, userAction, true);
    }).catch(() => {
      this._notify(updateType, commentToRemove, undefined, userAction, false, commentToRemove);
    });
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        info: {
          author: comment.author,
          text: comment.comment,
          emotion: comment.emotion,
        },
      },
    );

    const fieldsToDelete = ['author', 'comment', 'emotion'];
    for (const field of fieldsToDelete) {
      delete adaptedComment[field];
    }
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'author': comment.info.author,
        'comment': comment.info.text,
        'emotion': comment.info.emotion,
      },
    );

    delete adaptedComment.info;

    return adaptedComment;
  }

  static adaptToClientAddCommented(update) {
    const updatedComment = [];
    update.comments.map((comment) => {
      comment = Object.assign(
        {},
        comment,
        {
          info: {
            author: comment.author,
            text: comment.comment,
            emotion: comment.emotion,
          },
        },
      );

      const commentsFieldsToDelete = ['author', 'comment', 'emotion'];
      for (const field of commentsFieldsToDelete) {
        delete comment[field];
      }

      updatedComment.push(comment);
    });

    const film = update.movie;
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        actors: film.film_info.actors,
        age: film.film_info.age_rating,
        info: {
          originTitle: film.film_info.alternative_title,
          poster: film.film_info.poster,
          title: film.film_info.title,
        },
        description: film.film_info.description,
        regisseur: film.film_info.director,
        genre: film.film_info.genre,
        date: film.film_info.release.date,
        country: film.film_info.release.release_country,
        time: film.film_info.runtime,
        rating: film.film_info.total_rating,
        screenwriters: film.film_info.writers,
        isWatchlist: film.user_details.watchlist,
        isViewed: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchedData: film.user_details.watching_date,
      },
    );

    const filmFieldsToDelete = ['film_info', 'user_details'];

    for (const field of filmFieldsToDelete) {
      delete adaptedFilm[field];
    }
    return [adaptedFilm, updatedComment];
  }
}
