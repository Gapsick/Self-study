// 배열

let fruits = ["사과", "바나나", "포도"];
console.log(fruits[0]); // 사과
console.log(fruits.length); // 3

// 배열 메서드

let numbers = [1, 2, 3, 4, 5];

// 배열 요소 추가 및 삭제
numbers.push(6);    // 배열 끝에 추가 => [1, 2, 3, 4, 5, 6]
numbers.pop();     // 배열 끝 요소 삭제 => [1, 2, 3, 4, 5]
numbers.unshift(0);  // 배열 앞에 추가 => [0, 1, 2, 3, 4, 5]
numbers.shift();   // 배열 앞 요소 삭제 => [1, 2, 3, 4, 5]

// 특정 요소 삭제 (splice)
numbers.splice(2, 1);  // => [1, 2, 4, 5]

// 배열 순회
numbers.forEach(num => console.log(num)); // 1, 2, 4, 5

// 배열 변환
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 8, 10]

// 필터링
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// 배열 포함 여부 확인
console.log(numbers.includes(3)); // false (3은 제거됨)

// 객체
let persons = {
    name: "Kim",
    age: 25,
    job: "개발자"
};

// 속성 접근
console.log(persons.name); // Kim
console.log(persons["age"]); // 25

// 속성 추가 및 변경
persons.city = "Seoul";
persons.age = 26;

// 속성 삭제
delete persons.job;
console.log(persons); // { name: 'Kim', age: 26, city: 'Seoul' }

// 객체 순회 (for...in)
for (let key in person) {
    console.log(key, person[key]); // name Kim, age 26, city Seoul
}

// 객체 배열
let people = [
    { name: "Kim", age: 25},
    { name: "Lee", age: 30},
    { name: "Park", age: 28}
];

// 특정 조건의 객체 찾기 (find)
let found = people.find(person => person.name === "Lee");
console.log(found); // { name: 'Lee', age: 30 }

// 특정 조건의 객체 필터링 (filter)
let youngPeople = people.filter(person => person.age < 30);
console.log(youngPeople); // [ { name: 'Kim', age: 25 }, { name: 'Park', age: 28 } ]

// ES6 문법
let name = "Kim";
let greeting = `안녕하세요, 저는 ${name}입니다,`;
console.log(greeting);

// 화살표 함수
// 일반 함수
function add(a, b) {
    return a + b;
}

// 화살표 함수
const add = (a, b) => a + b;
console.log(add(1, 2)); // 3

// 구조 분해 할당
// 배열 구조 분해
let [a, b] = [10, 20];
console.log(a, b); // 10 20

// 객체 구조 분해
let user = { name2: "Kim", age: 25 };
let { name2, age } = user;
console.log(name2, age); // Kim 25

// 스프레드 연산자
let person1 = { name: "Kim", age: 25 };
let person2 = { ...person1, city: "Seoul" };
console.log(person2); // { name: 'Kim', age: 25, city: 'Seoul' }

// 기본 매개변수
function greet(name = "Guest") {
    console.log(`Hello, ${name}`);
}
greet(); // Hello, Guest
greet("Kim"); // Hello, Kim

