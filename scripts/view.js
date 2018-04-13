var TickerView = function(model) {
    this._model = model;
    this.init();
};

TickerView.prototype = {
    init: function() {
        var that = this;
        this._model._dispatcher.addEventListener(this._model._eventTypes.dataLoaded, function(e) {
            that.drawInitialGrid();
        });
    },

    drawInitialGrid: function() {
        var that = this,
            table =
                '<table class="ticker__table"><thead><tr>' +
                this.makeLabels() +
                '</tr></thead><tbody>' +
                this.makeTableRows(this._model._current) +
                '</tbody></table>';

        window.requestAnimationFrame(function() {
            that._model._elem.insertAdjacentHTML('afterBegin', table);
            that._model._table = that._model._elem.querySelectorAll('.ticker__table')[0];
            that._model._table._tbody = that._model._table.querySelectorAll('tbody')[0];
            that._model.dispatch(that._model._eventTypes.gridReady);
        });
    },

    updateGrid: function(data) {
        var that = this,
            tbody = this._model._table._tbody;
        data.forEach(function(row, rowInc) {
            var trow = tbody.querySelectorAll('tr')[rowInc];
                trow.classList.remove('ticker__table__row--decrease');
                trow.classList.remove('ticker__table__row--increase');

            row.forEach(function(cell, cellInc) {
                if (cell !== '' && cell !== that._model._current[rowInc][cellInc]) {
                    var rowClass =
                        parseFloat(cell) < parseFloat(that._model._current[rowInc][cellInc])
                            ? 'ticker__table__row--decrease'
                            : 'ticker__table__row--increase';
                    trow.classList.add(rowClass);
                    var tcell = trow.querySelectorAll('td')[cellInc];
                    var tspan = tcell.querySelectorAll('span')[0];
                    var newspan = document.createElement('span');
                    newspan.textContent = cell;

                    tspan.classList.add('animate-out');
                    tcell.prepend(newspan);
                    newspan.classList.add('animate-in');
                }
            });
        });
        setTimeout(function() {
            var cells = tbody.querySelectorAll('td');
            [].forEach.call(cells, function(cell) {
                var oldCell = cell.querySelectorAll('.animate-out')[0];
                var newCell = cell.querySelectorAll('.animate-in')[0];
                if (!!oldCell && !!newCell) {
                    newCell.classList.remove('animate-in');
                    oldCell.parentNode.removeChild(oldCell);
                }
            });
        }, 350);
        that._model.dispatch(that._model._eventTypes.gridUpdate);
    },

    makeLabels: function() {
        var html = '';
        this._model._labels.forEach(function(label) {
            html += '<th class="ticker__table__title"><span>' + label + '</span></th>';
        });
        return html;
    },

    makeTableRows: function(data, checkCurrent) {
        checkCurrent = !!checkCurrent;
        var html = '';
        data.forEach(function(row) {
            var rowHtml = '';
            row.forEach(function(cell) {
                var rowClass = '';
                rowHtml += '<td class="ticker__table__cell' + rowClass + '"><span>' + cell + '</span></td>';
            });
            html += '<tr class="ticker__table__row">' + rowHtml + '</tr>';
        });
        return html;
    }
};
