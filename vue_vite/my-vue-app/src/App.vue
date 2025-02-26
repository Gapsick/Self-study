<template>
    <div id="app">
      <!-- 로그인 여부에 따라 라우터 뷰 설정 -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  onMounted(() => {
    const token = localStorage.getItem("token");
  
    // 토큰이 없으면 로그인 페이지로 리디렉션
    if (!token) {
      router.push("/login");
    } else {
      // 토큰이 있으면 메인 페이지로 리디렉션
      router.push("/main");
    }
  });
  </script>
  