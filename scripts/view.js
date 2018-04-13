var TickerView = function(model) {
    this._model = model;
    this.init();
};

TickerView.prototype = {
    init: function() {
        var that = this;
        this._model._dispatcher.addEventListener('data:loaded', function(e) {
            that.drawGrid();
        });
    },

    drawGrid: function() {
        var table =
            '<table class="ticker__table"><thead><tr>' +
            this.fetchLabels() +
            '</tr></thead><tbody>' +
            this.fetchTableRows(this._model._current) +
            '</tbody></table>';
        this._model._elem.insertAdjacentHTML('afterBegin', table);
        this._model._table = this._model._elem.querySelectorAll('.ticker__table')[0];
        var event = new Event('grid:ready');
        this._model._dispatcher.dispatchEvent(event);
    },

    updateGrid: function(data) {
        var tbody = this._model._table.querySelectorAll('tbody')[0],
            that = this,
            html = '';
        //console.log(tbody);
        var updatedRows = this.fetchTableRows(data, true);
        tbody.innerHTML = updatedRows;

        //window.requestAnimationFrame(function() {

        // setTimeout(function() {
        //     var updates = tbody.querySelectorAll('.ticker__table__cell--will-update');
        //     [].forEach.call(updates, function (item) {
        //         item.classList.remove('ticker__table__cell--will-update');
        //         item.classList.add('ticker__table__cell--updated');
        //     });
        //     setTimeout(function() {
        //         that.cleanup();
        //     }, 400);

        // }, 10);
        //});

        // do a settimeout 350ms and call a clean up to remove updated classes
        var event = new Event('grid:update');
        this._model._dispatcher.dispatchEvent(event);
    },

    cleanup: function() {
        var tbody = this._model._table.querySelectorAll('tbody')[0];
        var updates = tbody.querySelectorAll('.ticker__table__cell--updated');
        [].forEach.call(updates, function(item) {
            item.classList.remove('ticker__table__cell--updated');
        });
    },

    fetchLabels: function() {
        var html = '';
        this._model._labels.forEach(function(label) {
            html += '<th class="ticker__table__title"><span>' + label + '</span></th>';
        });
        return html;
    },

    fetchTableRows: function(data, checkCurrent) {
        checkCurrent = !!checkCurrent;
        var html = '',
            that = this;
        console.log(data);
        data.forEach(function(row, rowInc) {

            var rowHtml = '';
            row.forEach(function(cell, cellInc) {
                var rowClass = '';
                if (checkCurrent && (cell === '' || cell === that._model._current[rowInc][cellInc])) {
                    cell = that._model._current[rowInc][cellInc];
                } else if (checkCurrent && cell !== that._model._current[rowInc][cellInc]) {
                    that._model._current[rowInc][cellInc] = cell;
                    rowClass = 
                    ' ticker__table__cell--will-update';
                }
                rowHtml += '<td class="ticker__table__cell' + rowClass + '">' + cell + '</td>';
            });
            html += '<tr>' + rowHtml + '</tr>';
        });
        return html;
    }
};
