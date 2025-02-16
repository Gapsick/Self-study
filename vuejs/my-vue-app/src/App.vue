<template>
  <div>
    <h1>📌 학과 웹 프로젝트</h1>
    
    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/notice">공지사항</router-link>
    </nav>

    <router-view />  <!-- ✅ 현재 선택된 페이지를 표시 -->
  </div>
</template>

<script setup>
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}
</style>
