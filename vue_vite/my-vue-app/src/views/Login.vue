<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted } from "vue";
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()


const router = useRouter();

// ✅ 팝업 창에서 메시지를 받을 이벤트 리스너 한 번만 등록
onMounted(() => {
  window.addEventListener("message", handleMessage);
});

// ✅ 메시지 처리 함수 분리
function handleMessage(event) {
  console.log("🔍 메시지 수신: ", event.origin);

  if (event.origin !== "http://localhost:5000") {
    console.warn("🚨 허용되지 않은 출처에서 메시지 수신됨!");
    return;
  }

  console.log("✅ 메인 창에서 받은 메시지:", event.data);

  if (event.data.error) {
    alert(event.data.error);
    return;
  }

  if (event.data.token) {
    saveUserData(event.data);
    router.push("/main");
  } else if (event.data.needRegister) {
    localStorage.setItem("register_email", event.data.email);
    router.push("/register");
  }
}

// ✅ 로컬 스토리지 저장 함수 추가
function saveUserData(data) {
  const user = {
    name: data.name,
    email: data.email,
    role: data.role,
    grade: data.grade || null,
  }

  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem("token", data.token)
  localStorage.setItem("googleAccessToken", data.googleAccessToken || "")
  localStorage.setItem("refreshToken", data.refreshToken || "")

  auth.login(data.token, user)  // ✅ Pinia 상태 반영 추가
}


// ✅ Google 로그인 팝업 열기
async function openGooglePopup() {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/google/url");
    const googleLoginUrl = response.data.authUrl;

    // 🔹 팝업 창 열기
    window.open(googleLoginUrl, "Google Login", "width=500,height=600");
  } catch (error) {
    console.error("🚨 Google 로그인 URL 요청 실패:", error);
    alert("Google 로그인 URL 요청 실패!");
  }
}
</script>

<template>
  <div>
    <br><br><br>
    <h1>글시융 Portal</h1>
    <button @click="openGooglePopup">Google 로그인</button>
  </div>
</template>



