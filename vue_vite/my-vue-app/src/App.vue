<template>
  <div>
    <h1>Vue + Google OAuth 로그인</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      user: null, // 사용자 정보 저장
    };
  },
  methods: {
    async checkLoginStatus() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.log("❌ JWT 토큰 없음, 로그인 필요");
      return;
    }

    console.log("🔹 JWT 토큰 확인됨:", token);

    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ 자동 로그인 성공:", response.data);
      
      // ✅ 사용자 정보 저장
      this.user = response.data.userInfo;
      localStorage.setItem("userInfo", JSON.stringify(this.user));

      // ✅ 자동 로그인 후 프로필 페이지로 이동 확인 (콘솔 로그 추가)
      if (this.$route.path !== "/main") {
        console.log("🔹 `/main` 페이지로 이동 중...");
        this.$router.push("/main");
      } else {
        console.log("✅ 이미 `/main` 페이지에 있음");
      }

    } catch (error) {
      console.error("❌ 자동 로그인 실패:", error.response?.data || error.message);
      this.logout();
    }
  }
  },
  mounted() {
    this.checkLoginStatus(); // ✅ 페이지 로드 시 자동 로그인 확인
  }
};
</script>

<style>
h1 {
  text-align: center;
  margin-top: 20px;
}
</style>
