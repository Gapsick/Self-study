function Circle(radius) {
    this.radius = radius;   // 인스턴스가 자기만의 값을 갖도록 설정

    // 객체마다 메서드 복사
    this.getDiameter = function() {
        return 2 * this.radius;
    };
}

const circle1 = new Circle(5);
const circle2 = new Circle(10);

console.log(circle1.getDiameter());
console.log(circle2.getDiameter());