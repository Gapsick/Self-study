const obj = {};

Object.defineProperty(obj, 'x', {
    value: 100,
    writable: true,
    enumerable: true,
    configurable: true
});

console.log(obj.x)