<template>
    <div>
        <h2>Todo List</h2>
        <input v-model="newTask" placeholder="할 일을 입력하세요" @keyup.enter="addTask" />
        <button @click="addTask">추가</button>

        <ul>
            <TodoItem
              v-for="(task, index) in tasks"
              :key="task.id"
              :task="tasks"
              :index="index"
              @delete="deleteTask"
              @toggle="toggleTask"
            />
        </ul>
    </div>
</template>

<script>
import TodoItem from './TodoItem.vue';

export default {
    components: { TodoItem },
    data() {
        return {
            newTask: "",
            tasks: [],
            nextId: 1
        };
    },
    methods: {
        addTask() {
            if (this.newTask.trim() !== "") {
                this.task.push({
                    id: this.nextId,
                    text: this.newTask,
                    completed: false
                });
            }
            this.newTask ="";
            this.nextId++;
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

<style scoped>
h2 {
  color: #333;
}
</style>