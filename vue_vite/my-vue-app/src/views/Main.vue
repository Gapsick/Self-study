<template>
  <div>
    <h1>📅 메인 페이지</h1>
    <p>개인 캘린더 + 학과 캘린더를 함께 표시합니다.</p>

    <iframe
      :src="calendarURL"
      style="border: 0"
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
    ></iframe>

    <p>📌 직접 일정을 추가하려면 아래 버튼을 클릭하세요.</p>
    <a :href="addEventURL" target="_blank">
      <button>📅 Google Calendar에서 일정 추가</button>
    </a>

    <h2>📌 새 일정 추가</h2>
    <label>📅 캘린더 선택:
      <select v-model="selectedCalendar">
        <option value="primary">📌 개인 캘린더</option>
        <option :value="departmentCalendarId">🏫 학과 캘린더</option>
      </select>
    </label>
    <br />
    <button @click="addEventToGoogleCalendar">📅 Vue에서 일정 추가</button>

    <br /><br />
    <button @click="$router.push('/schedule')">📅 일정 페이지로 이동</button>

    <br /><br />
    <button @click="logout">로그아웃</button>

    <br /><br />
    <button v-if="isAdmin" @click="goToAdminPage">회원 승인 관리</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router"; // ✅ vue가 아니라 vue-router에서 가져와야 함!
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      userRole: "",
      isAdmin: false,
      calendarURL: "",
      addEventURL: "https://calendar.google.com/calendar/u/0/r/eventedit",
      departmentCalendarId:
        "c_30f3f7b040f8956812ff3902e0725752aa5b4ab176a7fd02f4d8327f0ee4179d@group.calendar.google.com",
      selectedCalendar: "primary",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
  const token = localStorage.getItem("token");
  const roleFromStorage = localStorage.getItem("role");

  console.log("🛠️ localStorage에서 가져온 role:", roleFromStorage);

  if (roleFromStorage) {
    this.userRole = roleFromStorage; // ✅ this.userRole로 저장
    this.isAdmin = roleFromStorage === "admin";
  } else {
    this.userRole = "student";  // 기본값
    this.isAdmin = false;
  }

  console.log("🔹 최종 설정된 userRole:", this.userRole);
  console.log("🔹 최종 설정된 isAdmin:", this.isAdmin);

  if (!token) {
    alert("로그인이 필요합니다!");
    this.$router.push("/login");  // ✅ this.$router.push() 사용
  }
},
  mounted() {
    this.calendarURL = `https://calendar.google.com/calendar/embed?src=primary&src=${encodeURIComponent(
      this.departmentCalendarId
    )}&ctz=Asia%2FSeoul`;
  },
  methods: {
    goToAdminPage() {
      this.router.push("/admin");
    },
    updateUserRole() {
      this.userRole = localStorage.getItem("role");
      this.isAdmin = this.userRole === "admin";
      console.log("🔄 관리자 확인 (updateUserRole):", this.userRole, this.isAdmin);
    },
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      this.$router.push("/login");
    },
  },
};
</script>
