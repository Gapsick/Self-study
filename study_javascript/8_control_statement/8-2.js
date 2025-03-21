var num = 2;
var kind;

// if 문
if (num > 0) {
    kind = '양수';  // 음수 구별 X
}
console.log(kind);  // 양수

// if...else 문
if (num > 0) {
    kind = '양수';
} else {
    kind = '음수';  // 0은 음수 X
}
console.log(kind);

// if...else if 문
if (num > 0) {
    kind = '양수';
} else if (num < 0) {
    kind = '움수';
} else {
    kind = '영';
}
console.log(kind)   // 양수