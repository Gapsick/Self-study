<template>
  <div>
    <h2>할일 목록</h2>
    <input v-model="newTask" placeholder="할 일을 입력하세요" />
    <button @click="addTask">추가</button>

    <ul v-if="tasks.length > 0">
        <li v-for="(task, index) in tasks" :key="index">
            {{ task }}
            <button @click="removeTask(index)">삭제</button>
        </li>
    </ul>
    <p v-else>할 일이 없습니다.</p>
  </div>
</template>

<script>
export default {
    data() {
        return {
            newTask: "",
            tasks: []
        };
    },
    methods: {
        addTask() {
            if (this.newTask.trim() !== "") {
                this.tasks.push(this.newTask);
                this.newTask = "";
            }
        },
        removeTask(index) {
            this.tasks.splice(index, 1);
        }
    }
};
</script>