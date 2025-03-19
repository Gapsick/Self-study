<template>
    <br><br><br><br><br><br>
    <div>
      <h2>관리자 대시보드</h2>
      <button @click="goUsers">회원 승인 관리</button>
      <button @click="goSubjects">과목 관리</button>
      <button @click="goTime">시간표 관리</button>
  
      <!-- 하위 라우트 보여줄 자리 -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router"
  const router = useRouter()
  
  function goUsers() {
  router.push('/admin/users')
}
function goSubjects() {
  router.push('/admin/subjects')
}
function goTime() {
  router.push('/admin/timetable')
}
  </script>
  