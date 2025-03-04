<template>
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/main" class="logo">📌 학과 시스템</router-link>
        
        <ul class="nav-links">
          <li><router-link to="/notices">공지사항</router-link></li>
          <li><router-link to="/schedule">일정 관리</router-link></li>
          <li v-if="userRole === 'admin'"><router-link to="/admin">회원 관리</router-link></li>
        </ul>
  
        <div class="nav-auth">
          <button v-if="isLoggedIn" @click="logout">로그아웃</button>
          <div v-else>
            <router-link to="/login">로그인</router-link>
            <router-link to="/register">회원가입</router-link>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isLoggedIn = ref(true); // 로그인 상태 (테스트용)
  const userRole = ref("admin"); // 사용자 역할 (테스트용)
  
  // 로그아웃 함수
  const logout = () => {
    isLoggedIn.value = false;
    router.push("/login");
  };
  </script>
  
  <style scoped>
  .navbar {
    background: #4A90E2;
    color: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .navbar-container {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: auto;
    align-items: center;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
    margin-left: 40px;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  .nav-links a:hover {
    text-decoration: underline;
  }
  
  .nav-auth {
    display: flex;
    gap: 10px;
  }
  
  button {
    background: white;
    color: #4A90E2;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background: #f0f0f0;
  }
  </style>
  