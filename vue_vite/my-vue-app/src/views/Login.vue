<template>
    <div>
      <h1>Google 로그인</h1>
      <button @click="openGooglePopup">Google 로그인 (팝업)</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  const router = useRouter();
  
  // ✅ Google 로그인 팝업 열기
  async function openGooglePopup() {
    try {
      // 🔹 백엔드에서 Google 로그인 URL 가져오기
      const response = await axios.get("http://localhost:5000/api/auth/google/url");
      const googleLoginUrl = response.data.authUrl;
  
      // 🔹 팝업 창 열기
      const popup = window.open(
        googleLoginUrl,
        "Google Login",
        "width=500,height=600"
      );
  
      // ✅ 팝업 창에서 인증 완료 후 메시지를 받을 이벤트 리스너 추가
      window.addEventListener("message", (event) => {
        if (event.origin !== "http://localhost:5000") return; // 보안 체크
        
        console.log("✅ 메인 창에서 받은 메시지:", event.data);

        if (event.data.error) {
            alert(event.data.error); // 🚨 에러 메시지 출력 (유효하지 않은 이메일 또는 승인 대기)
            return;
        }        
  
        if (event.data.token) {
        console.log("📢 (login.vue) 저장할 Access Token:", event.data.token);
        console.log("📢 (login.vue) 저장할 Google Access Token:", event.data.googleAccessToken || "없음");
        console.log("📢 (login.vue) 저장할 Refresh Token:", event.data.refreshToken || "없음");  // ✅ 디버깅용 콘솔 추가

        localStorage.setItem("token", event.data.token);
        localStorage.setItem("googleAccessToken", event.data.googleAccessToken || ""); // ✅ Google Access Token 저장
        localStorage.setItem("refreshToken", event.data.refreshToken || ""); // ✅ Refresh Token 저장
        localStorage.setItem("userEmail", event.data.email);
        localStorage.setItem("role", event.data.role);
        localStorage.setItem("userName", event.data.name);

        console.log("🔍 (login.vue) 저장 후 Refresh Token 확인:", localStorage.getItem("refreshToken"));

        router.push("/main");
      } else if (event.data.needRegister) {
        localStorage.setItem("register_email", event.data.email);
        router.push("/register");
      }
      });
    } catch (error) {
      console.error("🚨 Google 로그인 URL 요청 실패:", error);
      alert("Google 로그인 URL 요청 실패!");
    }
  }
  </script>
  