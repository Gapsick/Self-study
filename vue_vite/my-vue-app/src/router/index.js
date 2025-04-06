// router/index.js
import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import Main from "@/views/Main.vue"
import Schedule from "@/views/Schedule.vue"
import Register from "@/views/Register.vue"

import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ManageUsers from '@/views/admin/ManageUsers.vue'
import ManageSubjects from '@/views/admin/ManageSubjects.vue'
import ManageTimetable from '@/views/admin/ManageTimetable.vue'

import NoticeList from "@/views/Notice.vue"
import NoticeDetail from "@/views/NoticeDetail.vue"
import NoticeWrite from "@/views/NoticeWrite.vue"
import NoticeEdit from "@/views/NoticeEdit.vue"

import Timetable from "@/views/Timetable.vue"

import LineConnect from "@/views/LineConnect.vue"

const routes = [
  { path: "/", component: Login },
  { path: "/main", component: Main },
  { path: "/login", component: Login },
  { path: "/schedule", component: Schedule },
  { path: "/register", component: Register },
  { path: "/line-connect", component: LineConnect },

  // 부모 라우트: /admin -> 자식 라우트: /admin/users ...
  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      { path: "users", component: ManageUsers },
      { path: "subjects", component: ManageSubjects },
      { path: "timetable", component: ManageTimetable },
    ],
  },

  { path: "/notices", component: NoticeList },
  { path: "/notices/:id", component: NoticeDetail },
  { path: "/notices/write", component: NoticeWrite },
  { path: "/notices/edit/:id", component: NoticeEdit },

  { path: "/timetable", component: Timetable },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
