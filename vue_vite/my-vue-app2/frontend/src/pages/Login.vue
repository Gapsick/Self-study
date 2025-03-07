<template>
    <div class="login-container">
      <h1>로그인 페이지</h1>
      <button @click="handleGoogleLogin">Google 로그인</button>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const router = useRouter();
  
      const handleGoogleLogin = () => {
        console.log("✅ Google 로그인 버튼 클릭됨!");
  
        const popup = window.open(
          "http://localhost:5000/api/auth/google",
          "Google Login",
          "width=500,height=600"
        );
  
        window.addEventListener("message", (event) => {
          if (event.origin !== "http://localhost:5173") return; // ✅ 보안 체크
          console.log("✅ 부모 창에서 JWT 수신:", event.data);
  
          if (event.data.accessToken) {
            localStorage.setItem("accessToken", event.data.accessToken); // ✅ 직접 저장
            localStorage.setItem("refreshToken", event.data.refreshToken);
            popup.close();
            router.push("/main");
          }
        });
      };
  
      return { handleGoogleLogin };
    },
  };
  </script>
  
  
  