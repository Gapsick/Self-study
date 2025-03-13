<template>
    <div>
      <h2>회원가입</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="name" placeholder="이름" required />
        <input type="email" v-model="email" placeholder="이메일" required />
        <input type="password" v-model="password" placeholder="비밀번호" required />
        <button type="submit">회원가입</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        message: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: this.name,
            email: this.email,
            password: this.password
          });
          this.message = response.data.message;
        } catch (error) {
          this.message = error.response.data.message;
        }
      }
    }
  };
  </script>
  