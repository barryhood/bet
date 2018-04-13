var TickerView = function(model) {
    this._model = model;
    this.init();
};

TickerView.prototype = {
    // Add listener for data loaded event and then trigger the method to draw the initial grid view
    init: function() {
        var that = this;
        this._model._dispatcher.addEventListener(this._model._eventTypes.dataLoaded, function(e) {
            that.drawInitialGrid();
        });
    },

    // draw the initial grid view, once done fire an event to notify any listeners that the grid is ready
    drawInitialGrid: function() {
        var that = this,
            table =
                '<table class="' +
                this._model._cssClasses.table +
                '"><thead><tr>' +
                this.makeLabels() +
                '</tr></thead><tbody>' +
                this.makeTableRows(this._model._current) +
                '</tbody></table>';

        window.requestAnimationFrame(function() {
            that._model._elem.insertAdjacentHTML('afterBegin', table);
            that._model._table = that._model._elem.querySelectorAll('.' + that._model._cssClasses.table)[0];
            that._model._table._tbody = that._model._table.querySelectorAll('tbody')[0];
            that._model.dispatch(that._model._eventTypes.gridReady);
        });
    },

    // Called with latest delta by Controller after timed delay, updates grid with new data
    // handles clean up of old data once our CSS has transitioned it out
    updateGrid: function(data) {
        var that = this,
            tbody = this._model._table._tbody;
        data.forEach(function(row, rowInc) {
            var trow = tbody.querySelectorAll('tr')[rowInc];
            trow.classList.remove(that._model._cssClasses.rowDecrease);
            trow.classList.remove(that._model._cssClasses.rowIncrease);

            row.forEach(function(cell, cellInc) {
                if (cell !== '' && cell !== that._model._current[rowInc][cellInc]) {
                    var rowClass =
                        parseFloat(cell) < parseFloat(that._model._current[rowInc][cellInc])
                            ? that._model._cssClasses.rowDecrease
                            : that._model._cssClasses.rowIncrease;
                    trow.classList.add(rowClass);
                    var tcell = trow.querySelectorAll('td')[cellInc];
                    var tspan = tcell.querySelectorAll('span')[0];
                    var newspan = document.createElement('span');
                    newspan.textContent = cell;

                    tspan.classList.add(that._model._cssClasses.animateOut);
                    tcell.prepend(newspan);
                    newspan.classList.add(that._model._cssClasses.animateIn);
                    that._model._current[rowInc][cellInc] = cell;
                }
            });
        });
        setTimeout(function() {
            var cells = tbody.querySelectorAll('td');
            [].forEach.call(cells, function(cell) {
                var oldCell = cell.querySelectorAll('.' + that._model._cssClasses.animateOut)[0];
                var newCell = cell.querySelectorAll('.' + that._model._cssClasses.animateIn)[0];
                if (!!oldCell && !!newCell) {
                    newCell.classList.remove(that._model._cssClasses.animateIn);
                    oldCell.parentNode.removeChild(oldCell);
                }
            });
            that._model.dispatch(that._model._eventTypes.gridCleanup);
        }, 350);
        that._model.dispatch(that._model._eventTypes.gridUpdate);
    },

    // Create and return the label/title structure for the grid
    makeLabels: function() {
        var html = '',
            that = this;
        this._model._labels.forEach(function(label) {
            html += '<th class="' + that._model._cssClasses.title + '"><span>' + label + '</span></th>';
        });
        return html;
    },

    // Creates and returns the initial grid structure based on snapshot data
    makeTableRows: function(data) {
        var html = '',
            that = this;
        data.forEach(function(row) {
            var rowHtml = '';
            row.forEach(function(cell) {
                rowHtml += '<td class="' + that._model._cssClasses.cell + '"><span>' + cell + '</span></td>';
            });
            html += '<tr class="' + that._model._cssClasses.row + '">' + rowHtml + '</tr>';
        });
        return html;
    },

    createCanvasArray: function() {

    },

    updateCanvas: function() {
        var that = this;
        var canvas = this._model._canvas;
        var canvasData = this._model._canvasData;
        console.log(that._model._current[0][2]);
return;
        if(that._model._inc === 0) {
            canvasData.arr = [];
        }

        // /console.log(canvasData.arr.length);

        this._model._current.forEach(function(item, inc) {
            //console.log(item[2]);
            //console.log(inc);
            // canvasData.arr[inc] = canvasData.arr && canvasData.arr[inc] ? canvasData.arr[inc] : [];
            if(!canvasData.arr || !canvasData.arr[inc]) {
                canvasData.arr[inc] = [];
            }
            canvasData.arr[inc].push(item[2]);
        });
   console.log(this._model._inc,that._model._deltas.length,canvasData.arr);
        // reset array when we return to beginning


        // canvasData.ctx = canvas.getContext('2d');


        // canvasData.minY = 0;
        // canvasData.maxY = 6;

        canvas.style.width = '';
        canvas.style.height = '';

        //console.log(this._model._inc);
        canvasData.width = canvas.clientWidth;
        canvasData.height = canvas.clientHeight;
        canvas.style.width = canvasData.width + 'px';
        canvas.style.height = canvasData.height + 'px';

        // window.requestAnimationFrame(function() {

        
        canvasData.ctx = canvas.getContext('2d');

        // console.log(this.getCanvasXPixel(10));
        canvasData.ctx.lineWidth = 1;
        canvasData.ctx.strokeStyle = '#f00';
        canvasData.ctx.beginPath();
        canvasData.ctx.moveTo(0, 0);

        // console.log(canvasData.xPad, that.getCanvasY(0));

        for(var i = 1; i <= that._model._deltas.length; i ++) {


            var pos = that._model._deltas[i-1][0][2];
            
            
            //console.log(pos);
            canvasData.ctx.lineTo(that.getCanvasX(i), that.getCanvasY(i/2));

        }
        canvasData.ctx.stroke();

        // })
        
        // canvasData.ctx.beginPath();
        // canvasData.ctx.moveTo(0,150);
        // canvasData.ctx.lineTo(100,50);
        // canvasData.ctx.lineTo(200,150);
        // canvasData.ctx.stroke();

        //console.log(canvas, ctx);
    },
    getCanvasX: function(val) {
        // return (this._model._canvasData.width - this._model._canvasData.xPad) / this._model._deltas.length * val + (this._model._canvasData.xPad * 1.5);
        return this._model._canvasData.width / this._model._deltas.length * val;
        //return parseInt(((this._model._canvasData.width - this._model._canvasData.xPad) / this._model._deltas.length) * val, 10) - this._model._canvasData.xPad + .5;

    },
    getCanvasY: function(val) {
        val = val < 1 ? 1 : val;
        //console.log(this._model._canvasData.height);
        //return this._model._canvasData.height - (((this._model._canvasData.height - this._model._canvasData.yPad) / this._model._canvasData.maxY) * val) - this._model._canvasData.yPad;
        return (((this._model._canvasData.height) / this._model._canvasData.maxY) * val);
        // return 2; //this._model._canvasData.height / this._model._canvasData.maxY * val;//this._model._canvasData.height - ((this._model._canvasData.height / this._model._canvasData.maxY) * val);
        
    }
};
