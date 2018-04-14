// polyfill custom event function for IE
(function() {
    if (typeof (<any>window).CustomEvent === 'function') return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = (<any>window).Event.prototype;
    (<any>window).CustomEvent = CustomEvent;
})();

// Init our App passing in the ticker element
var elem = document.querySelectorAll('.ticker')[0];
var model = new TickerModel(elem),
    view = new TickerView(model),
    controller = new TickerController(model, view);