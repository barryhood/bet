var TickerModel = function() {
    this._snapshot = [];
    this._deltas = {}; // ?
    this._inc = 0;


    this._labels = [];

    //this.init();
}

TickerModel.prototype = {

    init: function() {


        //var event = new CustomEvent('build', { detail: elem.dataset.time });
        // iterate through data and fire custom event with new dataset, controller listens for this and updates model

    },

    handleSnapshot: function(data) {
        var rows = data.split(/\r\n|\r|\n/),
        that = this;
        this._labels = rows.shift().split(',');
        rows.forEach(function(row) {
            if(row) {
                that._snapshot.push(row.split(','));
            }
        });
    }



}