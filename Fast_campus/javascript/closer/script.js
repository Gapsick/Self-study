// function createCounter(callback) {
//     let count = 0;
//     return {
//       increment: function() {
//         count += 1;
//         return count;
//       },
//       getCurrentCount: function() {
//         return count;
//       }
//     }
// }

// const myCounter = createCounter();
// const myCounter2 = createCounter();
// myCounter.increment();
// myCounter.increment();
// myCounter2.increment();
// myCounter2.increment();
// myCounter2.increment();
// console.log(myCounter.getCurrentCount());
// console.log(myCounter2.getCurrentCount());


function createLogger(type) {
    return function(message) {
        console.log(`[${type}] ${message}`);
    }
}

const errorLogger = createLogger('ERROR');
const infoLogger = createLogger('INFO');
const warningLogger = createLogger('WARNING');

errorLogger('이것은 에러 메시지 입니다');
infoLogger('이것은 정보 메시지 입니다');
warningLogger('이것은 경고 메시지 입니다');


function add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}

console.log(add(1)(2));
console.log(add(1)(2)(3));