var TickerModel = function() {
    this._labels = [];
    this._snapshot = [];
    this._deltas = [];
    this._timers = [];
    this._inc = 0;
    this._loaded = null;
    this._fields = [];
    this._listeners = [];
}

TickerModel.prototype = {
    addSnapshot: function(data) {
        var rows = data.split(/\r\n|\r|\n/),
        that = this;
        this._labels = rows.shift().split(',');
        rows.forEach(function(row) {
            if(row) {
                that._snapshot.push(row.split(','));
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
            if(row) {
                row = row.split(',');
                if(row.length === 1) {
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
        if(this._snapshot.length && this._deltas.length) {
            this.set(this._loaded,'true');
        }
    },
    subscribe: function(cbk) {
        this._listeners.push(cbk);
    },
    set: function(key, val) {
        var that = this;
        this._fields[key] = val;
        this._listeners.forEach(function(listener) {
            listener.call(null, that);
        });    
    }
}