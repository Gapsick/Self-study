var Student = /** @class */ (function () {
    function Student(name, age) {
        this.name = name;
        this.age = age;
    }
    Student.prototype.introduce = function () {
        return "My name is ".concat(this.name, ", age ").concat(this.age);
    };
    return Student;
}());
var s1 = new Student("Kim", 23);
console.log(s1.introduce());
