import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Main from "@/views/Main.vue";
import Schedule from "@/views/Schedule.vue";
import Register from "@/views/Register.vue";
import Admin from "@/views/Admin.vue";
import NoticeList from "@/views/Notice.vue";
import NoticeDetail from "@/views/NoticeDetail.vue";
import NoticeForm from "@/views/NoticeForm.vue";
import NoticeWrite from "@/views/NoticeWrite.vue";



const routes = [
  { path: "/", component: Login },
  { path: "/main", component: Main },
  { path: "/login", component: Login },
  { path: "/schedule", component: Schedule },
  { path: "/register", component: Register }, // ✅ 여기에 문제가 없는지 확인
  { path: "/admin", component: Admin },
  { path: "/notices", component: NoticeList }, // 🔹 공지사항 목록
  { path: "/notices/:id", component: NoticeDetail }, // 🔹 공지사항 상세
  { path: "/notices/new", component: NoticeForm }, // 🔹 공지사항 작성 (관리자 전용)
  { path: "/notices/write", component: NoticeWrite }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
