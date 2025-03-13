<template>
    <div>
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="이메일" required />
        <input type="password" v-model="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        message: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: this.email,
            password: this.password
          });
          this.message = '로그인 성공!';
          localStorage.setItem('token', response.data.token); // JWT 토큰 저장
        } catch (error) {
          this.message = error.response?.data?.message || '로그인 실패';
        }
      }
    }
  };
  </script>
  