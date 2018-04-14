import { Greeter } from './greeter';

describe('Greeter', () => {
    it('should greet', () => {
        const greeter = new Greeter('BH');
        spyOn(console, 'log');

        greeter.greet();

        expect(console.log).toHaveBeenCalled();
    });
});
