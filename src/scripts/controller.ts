export var TickerController = function(model, view) {
  this._model = model;
  this._view = view;
  this._snapshotUrl = './data/snapshot.csv';
  this._delatsUrl = './data/deltas.csv';
  this.init();
};

TickerController.prototype = {
  // call our fetchData method on the two CSV files then listen for the dispatcher to notify that the data is available
  init: function() {
      var that = this;
      this.fetchData(this._snapshotUrl, this.snapshot.bind(this));
      this.fetchData(this._delatsUrl, this.deltas.bind(this));
      this._model._dispatcher.addEventListener(this._model._eventTypes.gridReady, function(e) {
          that.tickerTimer();
      });
  },

  // fetches our CSV data, accepts a URL and a success callback as parameters
  fetchData: function(url, callback) {
      var request = new XMLHttpRequest(),
          that = this;
      request.open('GET', url, true);
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              if (request.status === 200 || request.status == 0) {
                  callback(request.responseText);
              } else {
                  that.handleError('Error retrieving data:', request.statusText);
              }
          }
      };
      request.send(null);
  },

  // error handling for data issues would happen here
  handleError: function(text, status) {
      console.log(text, status);
  },

  // populate the initial snapshot data in the model
  snapshot: function(data) {
      this._model.addSnapshot(data);
  },

  // populate our deltas data in the mode
  deltas: function(data) {
      this._model.addDeltas(data);
  },

  // Iterates through our deltas, triggers view grid update after timed delay
  tickerTimer: function() {
      var that = this;
      setTimeout(function() {
          that._view.updateGrid(that._model._deltas[that._model._inc]);
          that._view.updateCanvas();
          that._model._inc = that._model._inc < that._model._timers.length - 1 ? that._model._inc + 1 : 0;
          that.tickerTimer();
      }, this._model._timers[this._model._inc]);
  }
};
