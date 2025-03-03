<template>
    <div class="login-container">
      <h1>로그인 페이지</h1>
      <button @click="handleGoogleLogin">Google 로그인</button>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const handleGoogleLogin = async () => {
  console.log("✅ Google 로그인 버튼 클릭됨!");
  try {
    const response = await axios.get("http://localhost:5000/api/auth/google");
    console.log("✅ 백엔드 응답:", response.data);

    if (response.data.url) {
      window.location.href = response.data.url; // ✅ 현재 창에서 로그인 페이지로 이동
      // 또는 새 창에서 열고 싶다면:
      // window.open(response.data.url, "_blank", "width=500,height=600");
    }
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
  }
};

  
      return { handleGoogleLogin };
    },
  };
  </script>
  