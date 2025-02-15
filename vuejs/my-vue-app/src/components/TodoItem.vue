<template>
    <li>
      <input type="checkbox" :checked="task.completed" @change="$emit('toggle', index)"/>
      <span :class="{ completed: task.completed }">{{ task.text }}</span>
      <button @click="$emit('delete', index)">삭제</button>
    </li>
  </template>
  
  <script>
  export default {
    props: ["task", "index"]
  };
  </script>
  
  <style scoped>
  .completed {
    text-decoration: line-through;
    color: gray;
  }
  </style>
  