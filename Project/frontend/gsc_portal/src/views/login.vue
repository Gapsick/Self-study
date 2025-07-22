<!-- login.vue -->
<template>
    <div>로그인 Page</div>
    <br><br>
    <button @click="googleURL">로그인</button>
</template>

<script setup>
function googleURL() {
    window.location.href = 'http://localhost:3000/auth/login'
}


</script>