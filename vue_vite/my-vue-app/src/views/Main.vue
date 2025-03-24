<template>
  <div class="app-container">
    <Navbar />

    <section id="main">
      <h2>📅 메인 페이지</h2>
      <button @click="goToSchedule">일정 페이지로 이동</button>
    </section>

    <section id="notices">
      <h2>📢 공지사항 보기</h2>
      <button @click="goToNotices">공지사항</button>
    </section>

    <section id="schedule">
      <h2>📆 시간표 보기</h2>
      <button @click="goToTimetable">시간표</button>
    </section>

    <section id="admin" v-if="isAdmin">
      <h2>🔒 관리자 기능</h2>
      <button @click="goToAdminPage">회원 승인 관리</button>
    </section>
  </div>
</template>


<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref, computed, onMounted } from "vue"
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const auth = useAuthStore()

// ✅ 반응형 computed
const userRole = computed(() => auth.userRole)
const isAdmin = computed(() => auth.isAdmin)
const isAuthenticated = computed(() => auth.isAuthenticated)


// ✅ 권한 체크
onMounted(() => {
  auth.checkAuth()

  console.log("✅ token:", auth.token);
  console.log("✅ userRole:", auth.userRole);
  console.log("✅ isAdmin:", auth.isAdmin);
  console.log("✅ isAuthenticated:", auth.isAuthenticated);

  if (!auth.isAuthenticated) {
    alert("로그인이 필요합니다!")
    router.push("/login")
  }
})

// ✅ 라우팅 함수
const navigateWithAuth = (path) => {
  if (!auth.isAuthenticated) {
    alert("로그인이 필요합니다!")
    router.push("/login")
    return
  }
  router.push(path)
}

const goToSchedule = () => navigateWithAuth("/schedule")
const goToNotices = () => navigateWithAuth("/notices")
const goToTimetable = () => navigateWithAuth("/timetable")
const goToAdminPage = () => navigateWithAuth("/admin")

const logout = () => {
  auth.logout()
  router.push("/login")
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.app-container {
  font-family: 'Nanum Gothic', sans-serif;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #f0f8ff;
  padding: 12px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 20px;
  justify-content: center;
  z-index: 999;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #eef6fd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 1000;
}

.nav-left {
  font-weight: bold;
  font-size: 18px;
  color: #1e3a8a;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  position: relative;
  padding-bottom: 4px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #2563eb;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #2563eb;
  transition: 0.3s;
}

.nav-item:hover::after {
  width: 100%;
}


section {
  padding: 100px 20px;
  min-height: 100vh;
  text-align: center;
  border-bottom: 1px solid #eee;
}

</style>
