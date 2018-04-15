export class TickerModel {
    // Our element is cached here
    _elem: Element;
    _dispatcher: Element;
    _snapshotUrl: string = './data/snapshot.csv';
    _deltasUrl: string = './data/deltas.csv';

    // Empty containers to cache the rendered table
    _table: Element;
    _tbody: Element;

    // Data containers
    _labels: string[] = [];
    _current: any[] = [];
    _deltas: any[] = [];
    _timers: number[] = [];
    _inc: number = 0;

    // Events that methods can listen for
    _eventTypes = {
        dataLoaded: <string>'data:loaded',
        gridReady: <string>'grid:ready',
        gridUpdated: <string>'grid:updated',
        gridCleanup: <string>'grid:cleaned'
    };
    // CSS class names
    _cssClasses = {
        table: <string>'ticker__table',
        rowDecrease: <string>'ticker__table__row--decrease',
        rowIncrease: <string>'ticker__table__row--increase',
        animateOut: <string>'animate-out',
        animateIn: <string>'animate-in',
        title: <string>'ticker__table__title',
        row: <string>'ticker__table__row',
        cell: <string>'ticker__table__cell'
    };

    _canvas: Element;
    _canvasData = {
        ctx: <any>null,
        minY: <number>0,
        maxY: <number>5,
        width: <number>0,
        height: <number>0,
        arr: <number[]>[],
        colours: <string[]>[
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
    constructor(elem: any) {
        this._elem = elem;
        this._dispatcher = this._elem;
        this._canvas = this._elem.querySelectorAll('.ticker__canvas')[0];
    }

    // Store labels and initial data set
    addSnapshot(data: string) {
        var rows = data.split(/\r\n|\r|\n/),
            that = this;
        this._labels = rows.shift().split(',');
        rows.forEach(function(row: any) {
            if (row) {
                that._current.push(row.split(','));
            }
        });
        this.dataLoaded();
    }
    // Store additional data sets
    addDeltas(data: string) {
        var rows = data.split(/\r\n|\r|\n/),
            that = this;
        var inc = 0;
        that._deltas[0] = [];
        rows.forEach(function(row: any) {
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
    dispatch(type: string) {
        var event = new Event(type);
        this._dispatcher.dispatchEvent(event);
    }
}
