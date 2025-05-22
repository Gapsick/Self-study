const inputTodoList = document.getElementById("inputTodoList");
const addInput = document.getElementById("addInput");
const makeList = document.getElementById("makeList");
const toDoList = document.getElementById("toDoList");

// 할일 추가 버튼
let inputCount = 1;
addInput.addEventListener("click", () => {
    inputCount++;
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.id = "input" + inputCount;
    newInput.placeholder = `할일을 입력하세요`;

    const wrapper = document.createElement("p");
    wrapper.appendChild(newInput);

    inputTodoList.appendChild(wrapper);
})

// 리스트 만들기
makeList.addEventListener("click", () => {
    // 기존 리스트 비우기 (중복 방지)
    toDoList.innerHTML = "";

    const inputs = inputTodoList.querySelectorAll("input");

    inputs.forEach(input => {
        const value = input.value.trim();
        if (value !== "") {
            const li = document.createElement("li");
            li.textContent = value;
            toDoList.appendChild(li);
        }
    });
});
