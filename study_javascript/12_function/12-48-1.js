function outer() {
    var x = 1;
    return function inner() {
        console.log(x);
    }
}

var fn = outer();
fn()

// 중첩 함수는 자신을 감싸고 있는 부모 함수의 변수에 접근 가능
// 이 구조는 스코프 체인으로 연결되어 있으며, 그 기억을 유지하는 것이 클로저