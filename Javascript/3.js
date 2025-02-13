async function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("서버에서 데이터 가져옴!");
        }, 2000);
    });
}

async function main() {
    console.log("1. 데이터 요청");
    let data = await fetchData();
    console.log("2. 데이터 받음:", data);
    console.log("3. 작업 완료");
}

main();

// 실행 결과
// 1. 데이터 요청
// (2초 후) 2. 데이터 받음: 서버에서 데이터 가져옴!
// 3. 작업 완료