// var greeting = 'hello';
// console.log(greeting)

// var greeting = 'hi';
// console.log(greeting)

// greeting = 'how are you?';
// console.log(greeting)

// // 중복 선언 불가, 재할당은 가능
// let greeting = 'hello';
// console.log(greeting);

// // let greeting = 'hi';
// // console.log(greeting);

// greeting = 'hi';
// console.log(greeting);

// // 중복 선언 X, 재할당 X
// const greeting = 'hello';
// console.log(greeting);

// greeting = 'hi';
// console.log(greeting);

// 유효한 참조 범위
// var => 함수 레벨 스코프
// function func() {
//     if(true){
//         var a = 'a';
//         console.log(a);
//     }
//     console.log(a);
// }
// console.log(a);
// func();

// let, const => block 레벨 스코프
// function func() {
//     if(true) {
//         let a = 'a';
//         console.log(a);
//     }
//     console.log(a);
// }

// func();

// // 호이스팅
// console.log(greeting);

// var greeting = 'hello';  // undefined
// let greeting = 'hello';  // let, const => TDZ : undefined 값 할당 X (초기화 X)

func();

function func() {
    console.log('hoisiting test');
}
