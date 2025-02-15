<template>
  <div>
    <h1>Todo List App</h1>
    <TodoList />
  </div>
</template>

<script>
import TodoList from "@/components/TodoList.vue";

export default {
  components: { TodoList }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
