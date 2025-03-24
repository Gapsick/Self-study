<template>
  <nav class="navbar" v-if="checkedAuth">
    <div class="navbar-container">
      <router-link to="/main" class="logo">📌 학과 시스템</router-link>

      <ul class="nav-links">
        <li><router-link to="/notices">공지사항</router-link></li>
        <li><router-link to="/schedule">일정 관리</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin">관리자 페이지</router-link></li>
      </ul>

      <div class="nav-auth">
        <button v-if="isAuthenticated" @click="logout">로그아웃</button>
        <div v-else>
          <router-link to="/login">로그인</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
  
<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from '@/stores/useAuthStore'
import { ref, onMounted, computed } from 'vue'

const router = useRouter()
const auth = useAuthStore()

const checkedAuth = ref(false)

const isAdmin = computed(() => auth.isAdmin) // ✅ computed로 감싸기
const isAuthenticated = computed(() => auth.isAuthenticated)

onMounted(() => {
  auth.checkAuth()  // 새로고침 시 복원

  console.log("🔍 Pinia userRole:", auth.userRole)
  console.log("🔍 isAdmin 계산 결과:", isAdmin.value)

  checkedAuth.value = true // ✅ 체크 완료
  
})

const logout = () => {
  auth.logout()
  router.push("/login")
}
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
  