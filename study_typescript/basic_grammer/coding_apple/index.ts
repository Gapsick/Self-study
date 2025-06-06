type Name = string | number;

let 이름 : Name = 123;

function 함수(x :number) :number {
    return x * 2
}

함수(123);

type Member = [number, boolean];
let john:Member = [123, true];

// 싸잡아서 등록
// 들어오는 key 속성은 모두 string
type Member1 = {
    [key :string] : string;
}
let johns : Member1 = { name: 'kim'}

// class
class User {
    name : string;
    constructor(name) {
        this.name = name;
    }
}