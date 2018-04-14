import { TickerModel } from './model';
import { TickerView } from './view';
import { TickerController } from './controller';

describe('TickerModel', () => {

    const elem = document.createElement('div');
    elem.classList.add('ticker');
    const model = new TickerModel(elem);

    it('should cache our DOM element', () => {
        const checkElementCached = model._elem instanceof Element;
        expect(checkElementCached).toBe(true);
    });

    const data = 
    `Label1,Label2,Label3,Label4
    Data1.1,Data1.2,Data1.3,Data1.4
    Data2.1,Data2.2,Data2.3,Data2.4`;
    model.addSnapshot(data);

    it('should accept data from our CSV and hydrate label and current objects', () => {
        expect(model._labels[2]).toBe('Label3');
        expect(model._current[0][1]).toBe('Data1.2');
    });

    const view = new TickerView(model); 
    const labelHTML = view.makeLabels();
    const expectedOutput = '<th class="ticker__table__title"><span>Label1</span></th><th class="ticker__table__title"><span>Label2</span></th><th class="ticker__table__title"><span>Label3</span></th><th class="ticker__table__title"><span>Label4</span></th>';

    it('should create some label HTML from our CSV data', () => {
        expect(labelHTML).toBe(expectedOutput);
    });

});
