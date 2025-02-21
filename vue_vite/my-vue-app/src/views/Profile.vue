<template>
    <div>
      <h2>내 프로필</h2>
      <p>이름: {{ user.name }}</p>
      <p>이메일: {{ user.email }}</p>
      <p>권한: {{ user.role }}</p>
      <p v-if="user.is_verified">✅ 승인된 사용자</p>
      <p v-else>❌ 승인 대기 중</p>
      <button @click="logout">로그아웃</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: JSON.parse(localStorage.getItem("userInfo")) || {} // 저장된 사용자 정보 불러오기
      };
    },
    methods: {
      logout() {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userInfo");
        this.$router.push("/"); // 로그인 페이지로 이동
      }
    }
  };
  </script>
  