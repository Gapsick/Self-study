<template>
    <header class="nav-bar">
      <div class="nav-content">
        <div class="logo">GSC Portal</div>
  
        <nav class="nav-menu">
          <RouterLink to="/main" class="nav-link">메인</RouterLink>
          <RouterLink to="/notices" class="nav-link">공지</RouterLink>
          <RouterLink to="/schedule" class="nav-link">일정</RouterLink>
          <RouterLink to="/timetable" class="nav-link">시간표</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin" class="nav-link">관리자</RouterLink>
        </nav>
  
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/useAuthStore'
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const isAdmin = computed(() => authStore.isAdmin)
  
  function logout() {
    authStore.logout()
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .nav-bar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 70px;
    background-color: #f4faff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    z-index: 999;
    display: flex;
    justify-content: center;
  }
  
  .nav-content {
    width: 100%;
    max-width: 1200px;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 22px;
    font-weight: 700;
    color: #1e3a8a;
  }
  
  .nav-menu {
    display: flex;
    gap: 30px;
  }
  
  .nav-link {
    font-size: 15px;
    color: #333;
    font-weight: 500;
    text-decoration: none;
    position: relative;
  }
  
  .nav-link.router-link-active {
    color: #1d4ed8;
    font-weight: bold;
  }
  
  .logout-btn {
    background: none;
    border: none;
    color: #1d4ed8;
    font-size: 14px;
    cursor: pointer;
  }
  
  .logout-btn:hover {
    text-decoration: underline;
  }
  </style>
  