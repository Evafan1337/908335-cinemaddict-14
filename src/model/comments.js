import Observer from './observer';

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._commentList = [];
  }

  setCommentsFilm(comments, film) {
    this._commentList = comments.slice();
    this._notify(this._commentList, film);
  }

  getCommentsFilm() {
    return this._commentList;
  }

  addComment(comments, film) {
    this._commentList = comments.slice();

    this._notify(this._commentList, film);
  }

  updateComment(update) {
    const index = this._commentList.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting film');
    }

    this._commentList = [
      ...this._commentList.slice(0, index),
      update,
      ...this._commentList.slice(index + 1)
    ];
    this._notify(this._commentList, update);
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
        }
    );

    delete adaptedComment.author;
    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    console.log('adaptToServer');
    console.log(comment);
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "author": comment.info.author,
          "comment": comment.info.text,
          "emotion": comment.info.emotion,

        }
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
          }
      );

      delete comment.author;
      delete comment.comment;
      delete comment.emotion;

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
          watchedData: film.user_details.watching_date
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return [adaptedFilm, updatedComment];
  }
}