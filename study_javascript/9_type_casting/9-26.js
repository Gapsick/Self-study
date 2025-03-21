var elem = null;

var value = elem?.value;
console.log(value)

// 즉, elem이 null 또는 undefined면 그냥 undefined 반환함 (오류 없이).
// 그런데 elem이 5니까 .value 접근을 시도하게 됨.