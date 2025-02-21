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
            + `&scope=email profile openid`
            + `&access_type=offline`;

  
        window.location.href = googleAuthURL; // Google 로그인 페이지로 이동
      },
  
      async handleGoogleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
  
        if (code) {
          console.log("OAuth Code:", code);
          this.debugData = { code }; // 화면에 code 표시
  
          try {
            const response = await axios.post("http://localhost:5000/api/auth/google", { code });
  
            console.log("Server Response:", response.data);
            this.debugData = response.data; // API 응답을 화면에 표시
  
            if (response.data.message === "NEW_USER") {
              this.$router.push({
                path: "/register",
                query: { email: response.data.email, name: response.data.name, google_id: response.data.google_id },
              });
            } else {
              // ✅ JWT 토큰과 사용자 정보 저장
              localStorage.setItem("jwtToken", response.data.jwtToken);
              localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));

              this.message = "로그인 성공!";
              
              // ✅ 로그인 후 프로필 페이지로 이동
              this.$router.push("/profile");
            }
          } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            this.debugData = error.response?.data || "로그인 실패";
          }
        }
      }
    },
    mounted() {
      this.handleGoogleCallback();
    }
  };
  </script>
  