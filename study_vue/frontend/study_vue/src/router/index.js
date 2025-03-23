// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = []; // 👉 아무 route도 등록하지 않음

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
