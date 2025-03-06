import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Main from "@/views/Main.vue";
import Schedule from "@/views/Schedule.vue";
import Register from "@/views/Register.vue";
import Admin from "@/views/Admin.vue";

import NoticeList from "@/views/Notice.vue";
import NoticeDetail from "@/views/NoticeDetail.vue";
import NoticeWrite from "@/views/NoticeWrite.vue"; // ✅ 작성 페이지
import NoticeEdit from "@/views/NoticeEdit.vue"; // ✅ 수정 페이지

import Timetable from "@/views/timetable.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/main", component: Main },
  { path: "/login", component: Login },
  { path: "/schedule", component: Schedule },
  { path: "/register", component: Register },
  { path: "/admin", component: Admin },
  { path: "/notices", component: NoticeList }, // 🔹 공지사항 목록
  { path: "/notices/:id", component: NoticeDetail }, // 🔹 공지사항 상세
  { path: "/notices/write", component: NoticeWrite }, // ✅ 공지사항 작성
  { path: "/notices/edit/:id", component: NoticeEdit }, // ✅ 공지사항 수정
  { path: '/timetable', component: Timetable},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
