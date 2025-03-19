<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import "@/assets/global.css";
import Navbar from "@/components/Navbar.vue";  // ✅ components 폴더에서 불러오기

const authStore = useAuthStore();
const router = useRouter();
const checkedAuth = ref(false); // ✅ 인증 확인 완료 여부

// 🚀 앱이 실행될 때 JWT 확인 후 페이지 이동
onMounted(() => {
  authStore.checkAuth();
  if (authStore.isAuthenticated) {
    router.push("/main"); // ✅ 로그인된 상태라면 메인 페이지로 이동
  } else {
    router.push("/login"); // ✅ 로그인되지 않았다면 로그인 페이지로 이동
  }

  checkedAuth.value = true;
});
</script>

<template>
  <Navbar v-if="checkedAuth && authStore.isAuthenticated" />
  <router-view /> <!-- 현재 라우트된 페이지 표시 -->
</template>
