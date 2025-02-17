import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";  // ✅ 메인 페이지 컴포넌트
import BoardForm from "@/views/BoardForm.vue"; // ✅ 게시물 작성 페이지

const routes = [
  { path: "/", component: MainPage },  // ✅ 기본 페이지를 MainPage.vue로 설정
  { path: "/board/new", component: BoardForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
