<template>
    <div>
      <h2>로그인</h2>
      <button @click="googleLogin">Google 로그인</button>
      <p v-if="message">{{ message }}</p>
      <pre v-if="debugData">{{ debugData }}</pre>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        message: "",
        debugData: null
      };
    },
    methods: {
      googleLogin() {
        const CLIENT_ID = "1087749499426-3arq3def468ovjr4i40ckne5mi6bvfrg.apps.googleusercontent.com"; // Google Cloud에서 발급받은 클라이언트 ID
        const REDIRECT_URI = "http://localhost:5173/";
  
        const googleAuthURL = `https://accounts.google.com/o/oauth2/auth`
          + `?client_id=${CLIENT_ID}`
          + `&redirect_uri=${REDIRECT_URI}`
          + `&response_type=code`
          + `&scope=https://www.googleapis.com/auth/userinfo.email`
          + ` https://www.googleapis.com/auth/userinfo.profile`
          + ` openid`
          + ` https://www.googleapis.com/auth/calendar.readonly`
          + ` https://www.googleapis.com/auth/calendar.events`
          + `&access_type=offline`;

        
        console.log("🔹 Google OAuth 요청 URL:", googleAuthURL);
  
        window.location.href = googleAuthURL; // Google 로그인 페이지로 이동
      },
  
      async handleGoogleCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
          console.log("OAuth Code:", code);

          try {
              const response = await axios.post("http://localhost:5000/api/auth/google", { code });

              console.log("✅ 서버 응답 데이터:", response.data);

              // ✅ Google Access Token과 JWT 토큰을 먼저 저장
              if (response.data.access_token) {
                  localStorage.setItem("googleAccessToken", response.data.access_token);
                  console.log("✅ Google Access Token 저장 완료:", localStorage.getItem("googleAccessToken"));
              } else {
                  console.warn("⚠️ 서버에서 access_token이 반환되지 않음! 서버 응답:", response.data);
              }

              localStorage.setItem("jwtToken", response.data.jwtToken);
              localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));

              // ✅ 저장 후에 NEW_USER인지 확인하여 페이지 이동
              if (response.data.message === "NEW_USER") {
                  console.log("🔹 신규 사용자 → 회원가입 페이지로 이동");
                  this.$router.push({
                      path: "/register",
                      query: { 
                          email: response.data.userInfo.email, 
                          name: response.data.userInfo.name, 
                          google_id: response.data.userInfo.id 
                      },
                  });
              } else {
                  console.log("🔹 기존 사용자 → 메인 페이지로 이동");
                  this.$router.push("/main");  // ✅ 로그인 성공 후 메인 페이지로 이동
              }
          } catch (error) {
              console.error("❌ 로그인 실패:", error.response?.data || error.message);
          }
      }
  }

    },
    mounted() {
      this.handleGoogleCallback();
    }
  };
  </script>
  