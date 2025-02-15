import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import NoticeBoard from "../views/NoticeBoard.vue";
import QnABoard from "../views/QnABoard.vue";
import NoticeForm from "@/views/NoticeForm.vue";
import NoticeDetail from "@/views/NoticeDetail.vue";

const routes = [
  { path: "/", component: MainPage },  // 메인 페이지
  { path: "/notice", component: NoticeBoard },  // 공지사항 페이지
  { path: "/qna", component: QnABoard },  // Q&A 게시판 페이지
  { path: "/notice-form", component: NoticeForm },  // 작성 페이지
  { path: "/notice/:id", component: NoticeDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
