import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import Main from "@/views/Main.vue";
import Schedule from "@/views/Schedule.vue"

const routes = [
  { path: "/", component: Login }, // 기본 페이지
  { path: "/profile", component: Profile }, // 프로필 페이지
  { path: "/main", component: Main},
  { path: "/login", component: Login},
  { path: "/Schedule", component: Schedule}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
