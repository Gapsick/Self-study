<template>
  <div>
    <h2>To-Do List</h2>
    <input v-model="newTask" placeholder="할 일을 입력하세요" />
    <button @click="addTask">추가</button>

    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input type="checkbox" :checked="task.completed" @change="toggleTask(index)" />
        <span v-if="task.completed">✔️</span>
        {{ task.text }}
        <button @click="deleteTask(index)">삭제</button>
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
      if (this.newTask.trim() !== "") {
        this.tasks.push({ text: this.newTask, completed: false});
        this.newTask ="";
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    toggleTask(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
    }
  }
};
</script>