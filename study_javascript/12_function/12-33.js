function changeVal(primitive, obj) {
    primitive += 100;
    obj.name = 'Kim';
}

var num = 100;
var person = { name: 'Lee' };

console.log(num);
console.log(person);

changeVal(num, person);

console.log(num);   // 원시 값은 원본이 훼손되지 않음

console.log(person);    // 객체는 원본이 훼손됨