// 함수 선언문 -> 호이스팅 기능, 파싱 단계에서 바로 메모리에 등록
function add(x, y) {
    return x + y;
}

// 함수 표현식 -> 변수에 함수 객체를 값처럼 할당, 호이스팅 X 익명 함수 또는 이름 있는 함수 표현식도 가능
var add =function (x, y) {
    return x + y;
};

// Function 생성자 함수 -> 문자열로 매개변수, 본문을 전달, 실행 시 동적으로 컴파일, 매우 드물게 사용
var add = newFunction('x', 'y', 'return x + y');

// 화살표 함수(ES6) -> 간결한 문법, this를 바인딩 X, 메서드로는 부적절, arguments 객체 X, 익명 함수만 가능
var add = (x, y) => x + y;

