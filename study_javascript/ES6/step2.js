function counterMaker() {
    let count = 0;
    return function() {
        count++;
        console.log("현재 카운트:", count)
    }
}

const countUp = counterMaker();
countUp();
countUp();