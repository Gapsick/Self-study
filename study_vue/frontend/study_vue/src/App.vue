<template>
  <div>
    <h2>🎯 이벤트 핸들러 무명 함수</h2>
    <button @click="() => window.alert('무명 함수 실행됨')">무명함수 클릭</button>
    <button @click="handleClick">이름 있는 함수 클릭</button>

    <h2>🎯 클로저 함수 실습</h2>
    <button @click="runClosure">클로저 실행</button>

    <h2>🎯 ES6 문법 실습</h2>
    <button @click="es6Examples">ES6 예제 보기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 이름 있는 함수 (event handler)
function handleClick() {
  alert('이건 이름 있는 함수입니다.')
}

// 클로저 실습
function runClosure() {
  function outer() {
    let count = 0
    return function inner() {
      count++
      console.log('클로저 count:', count)
    }
  }

  const closureFn = outer()
  closureFn()
  closureFn()
  closureFn()
}

// ES6 문법 실습
function es6Examples() {
  const name = '민정'
  const age = 20

  // 템플릿 리터럴
  console.log(`안녕하세요, ${name}님은 ${age}살입니다.`)

  // 화살표 함수
  const multiply = (a, b) => a * b
  console.log('3 * 4 =', multiply(3, 4))

  // forEach + 화살표
  const animals = ['🐶', '🐱', '🐰']
  animals.forEach((a, i) => console.log(`${i + 1}번 동물: ${a}`))

  // 객체 단축 문법
  const user = { name, age }
  console.log('user 객체:', user)
}
</script>

<style scoped>
button {
  margin: 5px;
  padding: 10px;
  font-size: 14px;
}
</style>
