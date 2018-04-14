export var TickerView = function(model) {
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
          that.setColours();
          that._model.dispatch(that._model._eventTypes.gridReady);
      });
  },

  // Set some colours to act as a legend to our line graph
  setColours: function() {
      var that = this,
      tbody = this._model._table._tbody;
      this._model._canvasData.colours.forEach(function(colour, inc) {
          var trow = tbody.querySelectorAll('tr')[inc];
          trow.querySelectorAll('td')[0].style.color = colour;
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

  // Draws our canvas based on updates to current data set
  updateCanvas: function() {
      var that = this;
      var canvas = this._model._canvas;
      var canvasData = this._model._canvasData;
      if(that._model._inc === 0) {
          canvasData.arr = [];
      }
      this._model._current.forEach(function(item, inc) {
          if(!canvasData.arr || !canvasData.arr[inc]) {
              canvasData.arr[inc] = [];
          }
          canvasData.arr[inc].push(item[3]);
      });
      canvas.width = 'auto';
      canvas.height = 'auto';  
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      canvasData.width = canvas.clientWidth;
      canvasData.height = canvas.clientHeight;
      canvasData.ctx = canvas.getContext('2d');
      canvasData.ctx.clearRect(0, 0, canvasData.width, canvasData.height);
      canvasData.ctx.lineWidth = 2;
      canvasData.arr.forEach(function(item, inc) {
          canvasData.ctx.strokeStyle = canvasData.colours[inc];
          canvasData.ctx.beginPath();
          canvasData.ctx.moveTo(that.getCanvasX(0), that.getCanvasY(item[0]));
          item.forEach(function(data,dataInc) {
              canvasData.ctx.lineTo(that.getCanvasX(dataInc), that.getCanvasY(item[dataInc]));
          });
          canvasData.ctx.stroke();
      });
  },

  // Pass in a value to return X position (this will be a simple increment)
  getCanvasX: function(val) {
      return this._model._canvasData.width / (this._model._deltas.length-1) * val;
  },

  // Pass in a value to return Y position (this will be our data)
  getCanvasY: function(val) {
      return (this._model._canvasData.height - (((this._model._canvasData.height) / this._model._canvasData.maxY) * val)) / 2;
  }
};
