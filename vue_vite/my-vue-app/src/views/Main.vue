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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ✅ 반응형 변수 선언
const userName = ref("");
const userRole = ref("");
const isAdmin = ref(false);
const isAuthenticated = ref(false);
const calendarURL = ref("");

// ✅ localStorage에서 로그인 정보 가져오기
onMounted(() => {
  const token = localStorage.getItem("token");
  const roleFromStorage = localStorage.getItem("role");

  console.log("🛠️ localStorage에서 가져온 role:", roleFromStorage);

  if (roleFromStorage) {
    userRole.value = roleFromStorage;
    isAdmin.value = roleFromStorage === "admin";
  } else {
    userRole.value = "student";
    isAdmin.value = false;
  }

  isAuthenticated.value = !!token; // ✅ 토큰이 있으면 로그인 상태

  console.log("🔹 최종 설정된 userRole:", userRole.value);
  console.log("🔹 최종 설정된 isAdmin:", isAdmin.value);

  if (!isAuthenticated.value) {
    alert("로그인이 필요합니다!");
    router.push("/login");
  }

  // ✅ Google Calendar URL 설정
  calendarURL.value = `https://calendar.google.com/calendar/embed?src=primary&ctz=Asia%2FSeoul`;
});

// ✅ 로그인 확인 후 라우팅하는 함수
const navigateWithAuth = (path) => {
  if (!isAuthenticated.value) {
    alert("로그인이 필요합니다!");
    router.push("/login");
    return;
  }
  router.push(path);
};

// ✅ 페이지 이동 함수
const goToSchedule = () => navigateWithAuth("/schedule");
const goToNotices = () => navigateWithAuth("/notices");
const goToTimetable = () => navigateWithAuth("/timetable");
const goToAdminPage = () => navigateWithAuth("/admin");

// ✅ 로그아웃 함수
const logout = () => {
  ["jwtToken", "token", "refreshToken", "userInfo", "googleAccessToken", "role", "userName"].forEach((key) =>
    localStorage.removeItem(key)
  );

  router.push("/login");
};
</script>
