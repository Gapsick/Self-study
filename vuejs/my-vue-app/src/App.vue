<template>
  <div>
    <h2>To-Do List 만들기</h2>
    <input v-model="newTask" placeholder="할 일을 입력하세요" />
    <button @click="addTask">추가</button>

    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        {{ task }}
        <button @click="deleteTask">삭제</button>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: "",
      tasks: []
    }
  },
  methods: {
    addTask() {
      if (this.newTask.trim() !== "" ) {
        this.tasks.push(this.newTask);
        this.newTask ="";
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    }

  }
}


</script>