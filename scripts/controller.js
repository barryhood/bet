var TickerController = function(model, view) {
    this._model = model;
    this._view = view;

    this.init();

}

TickerController.prototype = {
    init: function() {
        console.log('init controller');
        //this._model.init();
        this.readCSV('./data/snapshot.csv');
    },





    readCSV: function(url) {
        var fileRead = new XMLHttpRequest();
        fileRead.open("GET", url, true);
        fileRead.onreadystatechange = function () {
            if(fileRead.readyState === 4) {
                if(fileRead.status === 200 || fileRead.status == 0) {
                    var allText = fileRead.responseText;
                    console.log(allText);
                }
            }
        }
        fileRead.send(null);
    }





}