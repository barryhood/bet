var TickerView = function(model) {
    this._model = model;
    this.init();
}

TickerView.prototype = {
    init: function() {
        var that = this;
        this._model._dispatcher.addEventListener('data:loaded', function(e) {
            that.drawGrid();
        });
    },
    
    drawGrid: function() {
        var table = '<table class="ticker__table"><thead><tr>'
            + this.fetchLabels()
            + '</tr></thead><tbody>'
            + this.fetchTableRows(this._model._snapshot)
            + '</tbody></table>';
        this._model._dispatcher.insertAdjacentHTML('afterBegin', table);
        var event = new Event('grid:ready');
        this._model._dispatcher.dispatchEvent(event);
    },

    fetchLabels: function() {
        var html = '';
        this._model._labels.forEach(function(label) {
            html += '<th class="ticker__table__title"><span>' + label + '</span></th>';
        });
        return html;
    },

    fetchTableRows: function(data) {
        var html = '';
        data.forEach(function(row, inc) {
            var rowHtml = '';
            row.forEach(function(cell) {
                rowHtml += '<td class="ticker__table__cell">' + cell + '</td>';
            });
            html += '<tr>' + rowHtml + '</tr>';
        });
        return html;    
    }
}