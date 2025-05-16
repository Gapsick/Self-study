<template>
  <h2>My Todos</h2>

  <!-- 입력창 + 버튼 -->
  <input v-model="newTodo" placeholder="할 일을 적어보세요" />
  <button @click="addTodo">추가</button>

  <!-- 목록 -->
  <ul>
    <li v-for="(todo, i) in todos" :key="i">
      {{ todo }}
    </li>
  </ul>
  
</template>

<script setup>
import { ref } from 'vue'

const newTodo = ref('')
const todos = ref([])

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push(newTodo.value.trim())
    newTodo.value = ''
  }
}

</script>