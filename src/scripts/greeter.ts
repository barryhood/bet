
export class Greeter {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    greet(): void {
        console.log(`Hi, ${this.name}!`);
        let BH = ['t1', 't2', 't3'];
        console.log(BH.map(part => `var: ${part}`));
    }
}