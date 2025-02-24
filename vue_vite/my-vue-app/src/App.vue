<template>
  <div>
    <template v-if="isAuthenticated">
      <nav>
        <router-link to="/main">🏠 메인</router-link> |
        <router-link to="/schedule">📅 일정</router-link> |
        <button @click="logout">🚪 로그아웃</button>
      </nav>
    </template>

    <router-view />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      user: null,  // 사용자 정보 저장
      isAuthenticated: false,  // 로그인 상태
    };
  },
  methods: {
    async checkLoginStatus() {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.log("❌ JWT 토큰 없음, 로그인 필요");
        this.isAuthenticated = false;
        return;
      }

      console.log("🔹 JWT 토큰 확인됨:", token);

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ 자동 로그인 성공:", response.data);
        
        this.user = response.data.userInfo;
        localStorage.setItem("userInfo", JSON.stringify(this.user));
        this.isAuthenticated = true;

        // ✅ 현재 페이지가 `/main`이 아니라면 `/main`으로 이동
        if (this.$route.path === "/") {
          console.log("🔹 `/main` 페이지로 이동 중...");
          this.$router.push("/main");
        } else {
          console.log(`✅ 현재 위치: ${this.$route.path}`);
        }

      } catch (error) {
        console.error("❌ 자동 로그인 실패:", error.response?.data || error.message);
        this.logout();
      }
    },
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("googleAccessToken");
      this.isAuthenticated = false;
      this.$router.push("/");
    }
  },
  created() {
    this.checkLoginStatus(); // ✅ 페이지 로드 시 자동 로그인 확인
  }
};
</script>

<style>
nav {
  text-align: center;
  padding: 10px;
  font-size: 18px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background: red;
  color: white;
  cursor: pointer;
}
</style>
