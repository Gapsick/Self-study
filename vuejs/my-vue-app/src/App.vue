<template>
  <div>
    <h1>Vue Router 테스트</h1>
    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/about">소개</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
nav {
  margin-bottom: 20px;
}
</style>
