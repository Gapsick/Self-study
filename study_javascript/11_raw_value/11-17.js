var person = {
    name: 'Lee'
}

var copy = person;

console.log(copy === person);

copy.name = 'Kim';

person.address = 'Seoul';

console.log(person);
console.log(copy);

// 얕은 복사! -> 객체의 주소를 공유한 것