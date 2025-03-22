const user = {
    name: "민정",
    age: 21
  };
  
  const { name, age } = user;
  console.log(`이름: ${name}, 나이: ${age}`);
  
  const fruits = ["🍎", "🍌", "🍇"];
  const newFruits = [...fruits, "🍓"];
  console.log(newFruits);
  
  const sayHello = (user) => `안녕하세요 ${user}님`;
  console.log(sayHello("민정"));
  