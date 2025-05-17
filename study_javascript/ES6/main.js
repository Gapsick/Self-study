let score = 0;

// html 요소 가져오기
const scoreText = document.getElementById("scoreText");
const resultText = document.getElementById("resultText");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");

// 결과 평가 함수
const evaluateScore = () => {
    if (score >= 90) {
        resultText.textContent = "결과: 합격"
    } else {
        resultText.textContent = "결과: 불합격"
    }
}

// 버튼 함수
addBtn.addEventListener("click", () => {
    score += 10;

    // 화면에 표시
    scoreText.textContent = `현재 점수: ${score}`;

    evaluateScore();
})

resetBtn.addEventListener("click", () => {
    score = 0;

    scoreText.textContent = `현재 점수: 0`;
    resultText.textContent = `결과: -`;
})