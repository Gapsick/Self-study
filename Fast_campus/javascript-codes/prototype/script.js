// let user = {
//     name: 'John',
//     age: 45,
//     email: 'john@example.com'
// }

// console.log(user.name);
// console.log(user.hasOwnProperty('email'));


function Person(name, email, birthdays) {
    this.name = name;
    this.email = email;
    this.birthday = new Date(birthdays);

}

// Person.prototype.calculateAge = function() {
//     const diff = Date.new() - this.birthday.getTime();
//     const ageDate= new Date(diff);
//     return Math.abs(ageDate.getUTCFullYear() - 1970);
// }

// const john = new Person('john', 'john@example.com', '7-10-91');
// const han = new Person('han', 'han@example.com', '2-10-91');
// console.log(john);
// console.log(han);

function Person(name, email, birthdays) {
    const person = Object.create(personsPrototype);
    person.name = name;
    person.email = email;
    person.birthday = new Date(birthdays);
    return person;
}

const personsPrototype = {
    calculateAge() {
    const diff = Date.new() - this.birthday.getTime();
    const ageDate= new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

const john = new Person('john', 'john@example.com', '7-10-91');
const han = new Person('han', 'han@example.com', '2-10-91');
console.log(john);
console.log(han);