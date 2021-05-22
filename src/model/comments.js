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
}