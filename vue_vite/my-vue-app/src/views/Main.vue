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
    <button @click="$router.push('/schedule')">📅 일정 페이지로 이동</button>

    <br /><br />
    <button @click="goToNotices">📢 공지사항 보기</button>

    <br /><br />
    <button @click="logout">로그아웃</button>

    <br /><br />
    <button v-if="isAdmin" @click="goToAdminPage">회원 승인 관리</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      userRole: "",
      isAdmin: false,
      calendarURL: "",
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
      this.userRole = roleFromStorage;
      this.isAdmin = roleFromStorage === "admin";
    } else {
      this.userRole = "student";
      this.isAdmin = false;
    }

    console.log("🔹 최종 설정된 userRole:", this.userRole);
    console.log("🔹 최종 설정된 isAdmin:", this.isAdmin);

    if (!token) {
      alert("로그인이 필요합니다!");
      this.$router.push("/login");
    }
  },
  mounted() {
    this.calendarURL = `https://calendar.google.com/calendar/embed?src=primary&ctz=Asia%2FSeoul`;
  },
  methods: {
    goToAdminPage() {
      this.router.push("/admin");
    },
    goToNotices() {
      this.router.push("/notices");
    }, 
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      this.$router.push("/login");
    },
  },
};
</script>