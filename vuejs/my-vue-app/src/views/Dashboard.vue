<template>
    <div>
      <h2>대시보드</h2>
      <p v-if="user">환영합니다, {{ user.name }}님!</p>
      <button @click="logout">로그아웃</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: null
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = response.data;
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.');
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  };
  </script>
  