var TickerController = function(model, view) {
    this._model = model;
    this._view = view;
    this._snapshotUrl = './data/snapshot.csv';
    this._delatsUrl = './data/deltas.csv';
    this.init();
}

TickerController.prototype = {
    init: function() {
        this.fetchData(this._snapshotUrl, this.snapshot.bind(this));
        this.fetchData(this._delatsUrl, this.deltas.bind(this));
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
        this._model.handleSnapshot(data);
        return this;
    },

    deltas: function(data) {
        //console.log(data);
    },

}