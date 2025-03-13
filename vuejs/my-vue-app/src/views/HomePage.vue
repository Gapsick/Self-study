<script setup>
import GoogleLogin from '@/components/GoogleLogin.vue';
import { ref } from 'vue';

const approvalMessage = ref('');
const showLogin = ref(true);

// ✅ 승인 대기 상태 메시지 표시
function handleApprovalPending(message) {
  approvalMessage.value = message;
  showLogin.value = false;
}

// ✅ 로그인 버튼 다시 표시
function resetLogin() {
  approvalMessage.value = '';
  showLogin.value = true;
}
</script>

<template>
  <div>
    <h1>학과 웹 로그인</h1>
    
    <div v-if="showLogin">
      <GoogleLogin @approval-pending="handleApprovalPending" />
    </div>
    
    <div v-else>
      <p style="color: red;">{{ approvalMessage }}</p>
      <button @click="resetLogin">다시 로그인</button>
    </div>
  </div>
</template>
