import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";
import Dashboard from "../pages/Main.vue"; // ✅ 추가
import Approval from "../pages/Approval.vue"; // ✅ 추가
import Main from "../pages/Main.vue";

const routes = [
  { path: "/", component: Login }, // ✅ 기본 경로를 로그인 페이지로 리디렉트
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/main", component: Main }, // ✅ 추가
  { path: "/admin/approval", component: Approval }, // ✅ 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
