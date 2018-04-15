import { TickerModel } from './scripts/model';
import { TickerView } from './scripts/view';
import { TickerController } from './scripts/controller';

// polyfill custom event function for IE
(function() {
  if (typeof (<any>window).CustomEvent === 'function') return false;
  function CustomEvent(event: any, params: any) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
  }
  CustomEvent.prototype = (<any>window).Event.prototype;
  (<any>window).CustomEvent = CustomEvent;
})();

// Init our App passing in the ticker element
const elem = document.querySelectorAll('.ticker')[0];
const model = new TickerModel(elem);
const view = new TickerView(model);
const controller = new TickerController(model, view);
