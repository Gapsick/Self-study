<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onMounted(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return
    }


    try {
        // ✅ Access Token을 `HttpOnly Cookie`에서 자동으로 가져와 인증 요청
        const response = await axios.get("http://localhost:5000/api/auth/me", {
            withCredentials: true // ✅ 쿠키를 포함한 요청
        });

        user.value = response.data.userInfo;
        router.push("/main"); // ✅ 로그인 상태면 메인 페이지로 이동
    } catch (error) {
        try {
            // ✅ Access Token이 만료되었을 경우, 자동으로 Refresh Token을 사용해 갱신 요청
            await axios.post("http://localhost:5000/api/auth/refresh", {}, { withCredentials: true });

            // ✅ 다시 로그인 요청 (Access Token이 갱신되었으므로 재시도)
            const response = await axios.get("http://localhost:5000/api/auth/me", {
                withCredentials: true
            });

            user.value = response.data.userInfo;
            router.push("/main");
        } catch (refreshError) {
            router.push("/login"); // ✅ 인증 실패 시 로그인 페이지로 이동
        }
    }
});

</script>
