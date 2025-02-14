<template>
  <div>
    <h1>Vue + Pinia 로그인 기능</h1>

    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/dashboard">대시보드</router-link>
    </nav>

    <!-- 로그인 상태에 따라 UI 변경 -->
    <div v-if="authStore.isAuthenticated">
      <p>로그인 됨: {{ authStore.user.name }}</p>
      <button @click="authStore.logout">로그아웃</button>
    </div>
    <div v-else>
      <button @click="handleLogin">로그인</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from './stores/authStore';

export default {
  setup() {
    const authStore = useAuthStore(); // Pinia Store 가져오기
    
    // 로그인 처리 (가짜 데이터 사용)
    function handleLogin() {
      const userData = { name: "홍길동", email: "hong@example.com"};
      authStore.login(userData);
    }

    return { authStore, handleLogin };
  }
};
</script>