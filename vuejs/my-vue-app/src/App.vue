<template>
  <div>
    <button @click="loginWithGoogle">Google 로그인</button>
    <button @click="logout">로그아웃</button>
    <p v-if="user">환영합니다, {{ user.name }}!</p>
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
      window.location.href = 'http://localhost:3000/auth/google';
    },
    checkToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
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
