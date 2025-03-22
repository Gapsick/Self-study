const obj = {};
const parent = { x: 1 };

Object.getPrototypeOf(obj);     // obj 객체의 프로토타입을 획득
Object.setPrototypeOf(obj, parent);     // obj 프로토타입을 교체

console.log(obj.x)