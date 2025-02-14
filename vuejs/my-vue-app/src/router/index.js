import { createRouter, createWebHistory } from "vue-router"; // Vue Router 기능 가져오기
import HomePage from "../components/HomePage.vue"; // 홈 페이지 컴포넌트 가져오기
import AboutPage from "../components/AboutPage.vue"; // 소개 페이지 컴포넌트 가져오기
import UserProfilePage from "@/components/UserProfilePage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import { useAuthStore } from "@/stores/authStore";

const routes = [
  { path: "/", component: HomePage }, // "/" 경로로 이동하면 HomePage.vue 표시
  { path: "/about", component: AboutPage }, // "/about" 경로로 이동하면 AboutPage.vue 표시
  { path: "/user/:id", component: UserProfilePage},
  { path: "/dashboard", component: DashboardPage, meta: {requiresAuth: true} }
];

const router = createRouter({
  history: createWebHistory(), // 브라우저에서 뒤로 가기/앞으로 가기 지원
  routes // 위에서 설정한 routes 배열 적용
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
})

export default router; // 다른 파일에서 router를 사용할 수 있도록 내보내기
