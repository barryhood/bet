var TickerView = function(model) {
    this._model = model;
    // this._model.subscribe(this.dataLoaded);
}

TickerView.prototype = {
    dataLoaded: function() {
        // console.log('view knows data has loaded');
    },

    drawGrid: function() {
        // console.log('drawGrid');
    }
}