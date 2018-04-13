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
                this.fetchLabels() +
                '</tr></thead><tbody>' +
                this.fetchTableRows(this._model._current) +
                '</tbody></table>';

        // invoke the HTML parser just once and ensure it's buffered to RAF
        window.requestAnimationFrame(function() {
            that._model._elem.insertAdjacentHTML('afterBegin', table);
            // cache our DOM elements so future iterations can be more performant
            that._model._table = that._model._elem.querySelectorAll('.ticker__table')[0];
            that._model._table._tbody = that._model._table.querySelectorAll('tbody')[0];
            // var event = new Event('grid:ready');
            //that._model._dispatcher.dispatchEvent(event);
            that._model.dispatch(that._model._eventTypes.gridReady);
        });
    },

    updateGrid: function(data) {
        var that = this,
            tbody = this._model._table._tbody;        
            data.forEach(function(row, rowInc) {
                row.forEach(function(cell, cellInc) {
                    
                    if(cell !== '' && cell !== that._model._current[rowInc][cellInc]) {
                        var trow = tbody.querySelectorAll('tr')[rowInc];
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
                [].forEach.call(cells, function (cell) {
                    var oldCell = cell.querySelectorAll('.animate-out')[0];
                    var newCell = cell.querySelectorAll('.animate-in')[0];
                    if(!!oldCell && !!newCell) {
                        newCell.classList.remove('animate-in');
                        oldCell.parentNode.removeChild(oldCell);
                    }
                });
            }, 350);

        //console.log(tbody);
        //var updatedRows = this.fetchTableRows(data, true);
        //tbody.innerHTML = updatedRows;

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
        that._model.dispatch(that._model._eventTypes.gridUpdate);
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
        // console.log(data);
        data.forEach(function(row, rowInc) {

            var rowHtml = '';
            row.forEach(function(cell, cellInc) {
                var rowClass = '';
                // if (checkCurrent && (cell === '' || cell === that._model._current[rowInc][cellInc])) {
                //     cell = that._model._current[rowInc][cellInc];
                // } else if (checkCurrent && cell !== that._model._current[rowInc][cellInc]) {
                //     that._model._current[rowInc][cellInc] = cell;
                //     rowClass = 
                //     ' ticker__table__cell--will-update';
                // }
                rowHtml += '<td class="ticker__table__cell' + rowClass + '"><span>' + cell + '</span></td>';
            });
            html += '<tr>' + rowHtml + '</tr>';
        });
        return html;
    }
};
