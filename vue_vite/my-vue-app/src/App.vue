<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// 🚀 앱이 실행될 때 JWT 확인 후 페이지 이동
onMounted(() => {
  authStore.checkAuth();
  if (authStore.isAuthenticated) {
    router.push("/main"); // ✅ 로그인된 상태라면 메인 페이지로 이동
  } else {
    router.push("/login"); // ✅ 로그인되지 않았다면 로그인 페이지로 이동
  }
});
</script>

<template>
  <router-view /> <!-- 현재 라우트된 페이지 표시 -->
</template>
