<template>
    <div>
      <h1 v-if="user">환영합니다, {{ user.name }}!</h1>
      <button v-if="!user" @click="loginWithGoogle">Google 로그인</button>
      <button v-if="user" @click="logout">로그아웃</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: null
      };
    },
    mounted() {
      this.checkToken();
    },
    methods: {
      loginWithGoogle() {
        console.log("✅ Google 로그인 버튼 클릭됨");
        const loginWindow = window.open(
          'http://localhost:3000/auth/google',
          '_blank',
          'width=500,height=600'
        );
  
        const checkPopupClosed = setInterval(() => {
          if (!loginWindow || loginWindow.closed) {
            clearInterval(checkPopupClosed);
            this.checkToken();
          }
        }, 1000);
      },
      checkToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
  
        if (token) {
          console.log("✅ JWT 토큰:", token);
  
          localStorage.setItem('jwt', token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.user = payload;
  
          window.history.replaceState({}, document.title, "/");
        }
      },
      logout() {
        localStorage.removeItem('jwt');
        this.user = null;
        window.location.reload();
      }
    }
  };
  </script>
  