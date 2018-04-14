export class TickerModel {
    // Our element is cached here
    _elem;
    _dispatcher;
    _snapshotUrl = './data/snapshot.csv';
    _deltasUrl = './data/deltas.csv';

    // // Empty containers to cache the rendered table
    _table = {};
    _tbody = {};

    // // Data containers
    _labels = [];
    _current = [];
    _deltas = [];
    _timers = [];
    _inc = 0;

    // // Events that methods can listen for
    _eventTypes = {
        dataLoaded: 'data:loaded',
        gridReady: 'grid:ready',
        gridUpdated: 'grid:updated',
        gridCleanup: 'grid:cleaned'
    };
    // // CSS class names
    _cssClasses = {
        table: 'ticker__table',
        rowDecrease: 'ticker__table__row--decrease',
        rowIncrease: 'ticker__table__row--increase',
        animateOut: 'animate-out',
        animateIn: 'animate-in',
        title: 'ticker__table__title',
        row: 'ticker__table__row',
        cell: 'ticker__table__cell'
    };

    // this._canvas = this._elem.querySelectorAll('.ticker__canvas')[0];
    _canvas;
    _canvasData = {
        ctx: null,
        minY: 0,
        maxY: 5,
        width: 0,
        height: 0,
        xPad: 10,
        yPad: 10,
        arr: [],
        colours: [
            'firebrick',
            'coral',
            'goldenrod',
            'green',
            'cornflowerblue',
            'hotpink    ',
            'indigo',
            'mediumorchid',
            'lawngreen',
            'orangered'
        ]
    };
    constructor(elem) {
        this._elem = elem;
        this._dispatcher = this._elem;
        this._canvas = this._elem.querySelectorAll('.ticker__canvas')[0];
    }

    // Store labels and initial data set
    addSnapshot(data) {
        var rows = data.split(/\r\n|\r|\n/),
            that = this;
        this._labels = rows.shift().split(',');
        rows.forEach(function(row) {
            if (row) {
                that._current.push(row.split(','));
            }
        });
        this.dataLoaded();
    }
    // Store additional data sets
    addDeltas(data) {
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
    }
    // Check both data sets have been stored and dispatches an event that our controller listens for
    dataLoaded() {
        if (this._current.length && this._deltas.length) {
            this.dispatch(this._eventTypes.dataLoaded);
        }
    }
    // Handle event dispatches
    dispatch(type) {
        var event = new Event(type);
        this._dispatcher.dispatchEvent(event);
    }
}
