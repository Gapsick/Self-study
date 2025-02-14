<template>
  <div>
    <h2>Vue Todo List</h2>

    <input v-model="newTask" placeholder="할 일을 입력하세요" @keyup.enter="addTask"/>
    <button @click="addTask">추가</button>
    <button @click="deleteAll">싹다 삭제</button>

    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input type="checkbox" v-model="task.completed" />
        <span :class="{ completed: task.completed }">{{ task.text }}</span>
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
      if (this.newTask.trim() === "") {
        alert("값이 없습니다")
      } else {
        this.tasks.push({ text: this.newTask, completed: false });
        this.newTask ="";
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    deleteAll() {
      if(confirm("정말 삭제할래?")) {
        this.tasks = [];
        alert("어 후회하지마")
      } else {
        alert("한번 봐줄게")
      }
    }
  }
}
</script>

<style>
.completed {
  text-decoration: line-through;
  color: gray;
}
</style>