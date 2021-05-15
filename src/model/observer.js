export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    console.log('addObserver:', observer);
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(...values) {
    console.log(this._observers);
    console.log('_notify:', ...values);
    // console.log(values);
    console.log('this._observers:',this._observers);
    // this._observers.forEach((observer) => observer(...values));
    this._observers.forEach((observer) => {
      // console.log('forEach');
      // console.log(observer);
      console.log('_notify next step');
      console.log(...values);
      console.log(observer);
      observer(...values);
    })
  }
}