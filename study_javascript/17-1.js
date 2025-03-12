class User {
    constructor(first, last) {
      this.firstName = first;
      this.lastName = last;
    }
  
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  
    set fullName(value) {
      const parts = value.split(" ");
      this.firstName = parts[0];
      this.lastName = parts[1];
    }
  }
  
  const user = new User("Min", "Jung");
  
  console.log(user.fullName);       // 👉 getter 실행: "Min Jung"
  
  user.fullName = "Kim Minjung";   // 👉 setter 실행
  console.log(user.firstName);     // 👉 "Kim"
  console.log(user.lastName);      // 👉 "Minjung"
  