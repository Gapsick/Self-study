var add = function(x,y) {
    this.result = x+y;
}

var obj = {};
//1. apply() 사용
add.apply(obj, [3,4])
//2. call() 사용
//3. bind() 사용

console.log(obj);