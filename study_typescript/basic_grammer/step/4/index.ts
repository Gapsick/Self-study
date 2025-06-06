interface User {
    name: string;
    age: number;
    isStudent?: boolean;    // 선택 속성
}

const user1: User = {
    name: "Alice",
    age: 20
}