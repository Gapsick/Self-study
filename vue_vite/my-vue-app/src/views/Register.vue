<template>
    <div>
      <h2>회원가입</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="student_id" placeholder="학번" required />
        <input type="text" v-model="phone" placeholder="전화번호" required />
        <input type="number" v-model="year" placeholder="학년" required />
        <label>
          <input type="checkbox" v-model="is_foreign" /> 유학생 여부
        </label>
        <button type="submit">회원가입</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { student_id: "", phone: "", year: "", is_foreign: false, message: "" };
    },
    methods: {
      async register() {
        const user = {
          google_id: this.$route.query.google_id,
          email: this.$route.query.email,
          name: this.$route.query.name,
          student_id: this.student_id,
          phone: this.phone,
          year: this.year,
          is_foreign: this.is_foreign
        };
  
        try {
          const response = await axios.post("http://localhost:5000/api/auth/register", user);
          this.message = response.data.message;
        } catch (error) {
          this.message = "회원가입 실패";
        }
      }
    }
  };
  </script>
  