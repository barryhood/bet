var TickerModel = function(elem) {
    this._elem = elem;
    this._dispatcher = this._elem;
    this._table = null;
    this._labels = [];
    this._current = [];
    this._deltas = [];
    this._timers = [];
    this._inc = 0;
};

TickerModel.prototype = {
    addSnapshot: function(data) {
        var rows = data.split(/\r\n|\r|\n/),
            that = this;
        this._labels = rows.shift().split(',');
        rows.forEach(function(row) {
            if (row) {
                that._current.push(row.split(','));
            }
        });
        this.dataLoaded();
    },
    addDeltas: function(data) {
        var rows = data.split(/\r\n|\r|\n/),
            that = this;
        var inc = 0;
        that._deltas[0] = [];
        rows.forEach(function(row) {
            if (row) {
                row = row.split(',');
                if (row.length === 1) {
                    that._timers.push(row);
                    inc++;
                    that._deltas[inc] = [];
                } else {
                    that._deltas[inc].push(row);
                }
            }
        });
        this._deltas.pop();
        this.dataLoaded();
    },
    dataLoaded: function() {
        if (this._current.length && this._deltas.length) {
            var event = new Event('data:loaded');
            this._dispatcher.dispatchEvent(event);
        }
    }
};
