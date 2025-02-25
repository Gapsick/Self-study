import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import Main from "@/views/Main.vue";
import Schedule from "@/views/Schedule.vue";
import Register from "@/views/Register.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/profile", component: Profile },
  { path: "/main", component: Main },
  { path: "/login", component: Login },
  { path: "/schedule", component: Schedule },
  { path: "/register", component: Register } // ✅ 여기에 문제가 없는지 확인
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
