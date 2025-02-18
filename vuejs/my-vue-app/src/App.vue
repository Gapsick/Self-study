<script setup>
import axios from 'axios';

let jwtToken = ''; // JWT 저장 변수

function handleSuccess(response) {
  console.log('Google 로그인 성공:', response);

  axios.post('http://localhost:3000/auth/google', {
    token: response.credential
  })
  .then(res => {
    console.log('서버 응답:', res.data);
    jwtToken = res.data.token; // ✅ JWT 저장
    localStorage.setItem('jwt', jwtToken); // ✅ JWT를 localStorage에 저장
  })
  .catch(err => {
    console.error('서버 요청 에러:', err);
  });
}

function handleError(error) {
  console.error('Google 로그인 실패:', error);
}
</script>

<template>
  <div>
    <h1>Google Login Test</h1>
    <GoogleLogin
      :callback="handleSuccess"
      :onError="handleError"
      ux-mode="popup"
    />
  </div>
</template>
