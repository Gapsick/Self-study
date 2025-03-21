var person = {
    name: 'Lee'
};

// property 동적 생성
person.age = 20;

// 삭제
delete person.age;

// 없어도 삭제 가능 -> error 안남
delete person.address;

console.log(person);