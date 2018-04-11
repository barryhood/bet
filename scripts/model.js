var TickerModel = function() {
    this._dataSet = {};
    this._newDataSet = {}; // ?
    this._inc = 0;
    //this.init();
}

TickerModel.prototype = {

    init: function() {
        var that = this;
        setInterval(function() {
            console.log('init');
        }, 2000);

        //var event = new CustomEvent('build', { detail: elem.dataset.time });

        // iterate through data and fire custom event with new dataset, controller listens for this and updates model

    }



}