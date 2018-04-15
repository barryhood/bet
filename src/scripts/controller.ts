export class TickerController {
  _model: any;
  _view: any;
  constructor(model: any, view: any) {
    var that = this;
    this._model = model;
    this._view = view;
    // call our fetchData method on the two CSV files then listen for the dispatcher to notify that the data is available
    this.fetchData(this._model._snapshotUrl, this.snapshot.bind(this));
    this.fetchData(this._model._deltasUrl, this.deltas.bind(this));
    this._model._dispatcher.addEventListener(this._model._eventTypes.gridReady, function(e: Event) {
        that.tickerTimer();
    });
  }

  // fetches our CSV data, accepts a URL and a success callback as parameters
  fetchData(url: string, callback: any) {
      var request = new XMLHttpRequest(),
          that = this;
      request.open('GET', url, true);
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              if (request.status === 200 || request.status === 0) {
                  callback(request.responseText);
              } else {
                  that.handleError('Error retrieving data:', request.statusText);
              }
          }
      };
      request.send(null);
  }

  // error handling for data issues would happen here
  handleError(text: string, status: string) {
      console.log(text, status);
  }

  // populate the initial snapshot data in the model
  snapshot(data: string) {
      this._model.addSnapshot(data);
  }

  // populate our deltas data in the mode
  deltas(data: string) {
      this._model.addDeltas(data);
  }

  // Iterates through our deltas, triggers view grid update after timed delay
  tickerTimer() {
      var that = this;
      setTimeout(function() {
          that._view.updateGrid(that._model._deltas[that._model._inc]);
          that._view.updateCanvas();
          that._model._inc = that._model._inc < that._model._timers.length - 1 ? that._model._inc + 1 : 0;
          that.tickerTimer();
      }, this._model._timers[this._model._inc]);
  }
};
