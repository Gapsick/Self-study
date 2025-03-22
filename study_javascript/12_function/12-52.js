function repeat(n, f) {
    for (var i = 0; i < n; i++) {
        f(i);
    }
}

repeat(5, function (i) {
    if (i % 2) console.log(i);
});

// 익명 함수도 변수처럼 다룰 수 있다
// 익명 함수를 직접 다른 함수의 인자로 전달해서 "콜백 함수"로 사용할 수 있다
// 익명 함수는 한 번만 사용할 때 간편하고, 즉석에서 로직을 정의하고 싶을 때 유용