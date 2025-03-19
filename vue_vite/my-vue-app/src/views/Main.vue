<template>
  <div>
    <h1>📅 메인 페이지</h1>

    <iframe
      :src="calendarURL"
      style="border: 0"
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
    ></iframe>

    <br /><br />
    <button @click="goToSchedule">📅 일정 페이지로 이동</button>
    <br /><br />
    <button @click="goToNotices">📢 공지사항 보기</button>
    <br /><br />
    <button @click="goToTimetable">📅 시간표 보기</button>
    <br /><br />
    <button @click="logout">로그아웃</button>
    <br /><br />
    <button v-if="isAdmin" @click="goToAdminPage">회원 승인 관리</button>
  </div>
</template>


<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref, computed, onMounted } from "vue"

const router = useRouter()
const auth = useAuthStore()

// ✅ 반응형 computed
const userRole = computed(() => auth.userRole)
const isAdmin = computed(() => auth.isAdmin)
const isAuthenticated = computed(() => auth.isAuthenticated)

const calendarURL = ref("https://calendar.google.com/calendar/embed?src=primary&ctz=Asia%2FSeoul")

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

