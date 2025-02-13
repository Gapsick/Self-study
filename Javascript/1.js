// 변수
var a = 10;
let b = 20;     // 값 변경 가능
const c = 30;   // 값 변경 불가능

// 데이터 타입
let number = 42;    // 숫자
let text = "Hello"; // 문자열
let isTrue = true;  // 불리언
let empty = null;   // Null
let notDefined; // undefined
let obj = {name: "Kim"};    // 객체
let arr = [1, 2, 3];    // 배열

// 연산자
let x = 10, y = 5;

console.log(x + y);
console.log(x - y);
console.log(x * y);
console.log(x / y);
console.log(x % y);

// 비교 연산자
console.log(x > y);
console.log(x < y);
console.log(x == 10);
console.log(x === "10");
console.log(x !== y);

// 논리 연산자
console.log(true && true);
console.log(true || false);
console.log(!true);

// 조건문
let age = 20;

if (age >= 18) {
    console.log("성인입니다.");
} else {
    console.log("미성년자입니다.");
}

// 삼항 연산자
let result = age >= 18 ? "성인" : "미성년자";
console.log(result);

// 반복문
// for
for (let i = 0; i < 5; i++) {
    console.log("반복 중: " + i);
}

// while
let count = 0;
while (count < 5) {
    console.log("while 반복 중: " + count);
    count++;
}

// forEach
let arr2 = [1, 2, 3, 4, 5];
arr2.forEach(function(item){
    console.log("배열 요소: " + item);
})

// 함수
function greet(name) {
    return "Hello," + name + "!";
}

console.log(greet("Kim"));

// 화살표 함수
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Kim"));