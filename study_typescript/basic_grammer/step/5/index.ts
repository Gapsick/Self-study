class Student {
    constructor(public name: string, private age: number) {}

    introduce(): string {
        return `My name is ${this.name}, age ${this.age}`
    }
}

const s1 = new Student("Kim", 23);
console.log(s1.introduce());