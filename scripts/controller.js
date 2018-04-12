var TickerController = function(model, view) {
    this._model = model;
    this._view = view;
    this._snapshotUrl = './data/snapshot.csv';
    this._delatsUrl = './data/deltas.csv';
    this.init();
}

TickerController.prototype = {
    init: function() {
        var that = this;
        this.fetchData(this._snapshotUrl, this.snapshot.bind(this));
        this.fetchData(this._delatsUrl, this.deltas.bind(this));

        this._model._dispatcher.addEventListener('grid:ready', function(e) {
            console.log('grid:ready', that);
            that.startTicker();
        });
    },

    fetchData: function(url, callback) {
        var request = new XMLHttpRequest(),
        that = this;
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if(request.readyState === 4) {
                if(request.status === 200 || request.status == 0) {
                    callback(request.responseText);
                } else {
                    that.handleError('Error retrieving data:', request.statusText);
                }
            }
        }
        request.send(null);
    },

    handleError: function(text, status) {
        console.log(text,status);
    },

    snapshot: function(data) {
        this._model.addSnapshot(data);
    },

    deltas: function(data) {
        this._model.addDeltas(data);
    },

    startTicker: function() {
        console.log(this._view.fetchTableRows(this._model._deltas[0]));

        // TO DO: we need to do some kind of diff on the data, maybe overwrite snapshot
        // with "current" view, then flag changed rows so we can e.g. add a "changed"
        // transitional class


    }

}