<template>
    <div class="main-container">
      <h1>메인 페이지</h1>
      <p v-if="user">환영합니다, {{ user.name }}님! (역할: {{ user.role }})</p>
      <p v-else>사용자 정보를 불러오는 중...</p>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import { useRouter, useRoute } from "vue-router";
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const route = useRoute();
      const user = ref(null);
  
      onMounted(async () => {
        // ✅ URL에서 token을 가져와 저장
        if (route.query.token) {
          authStore.setToken(route.query.token);
          router.replace("/main"); // ✅ URL 정리 (token 제거)
        }
  
        // ✅ 백엔드에서 사용자 정보 요청
        try {
          const response = await axios.get("http://localhost:5000/api/auth/user", {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
          user.value = response.data; // ✅ 사용자 정보 업데이트
        } catch (error) {
          console.error("❌ 사용자 정보 불러오기 실패:", error);
        }
      });
  
      return { user };
    },
  };
  </script>
  