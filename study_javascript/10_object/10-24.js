const obj = {
    name: 'Lee',
    // 메서드 축악 표현
    sayHi() {
        console.log('Hi! ' + this.name)
    }
};

obj.sayHi()