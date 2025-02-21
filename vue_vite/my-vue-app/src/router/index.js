import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";

const routes = [
  { path: "/", component: Login }, // 기본 페이지
  { path: "/profile", component: Profile } // 프로필 페이지
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
