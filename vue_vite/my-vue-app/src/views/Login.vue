<script setup>
import { nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// ✅ Google 로그인 버튼 클릭 시 백엔드에서 로그인 URL 요청
async function googleLogin() {
    try {
        console.log("🔹 Google 로그인 요청 시작!");
        const response = await axios.get("http://localhost:5000/api/auth/google/url");
        console.log("🔹 Google 로그인 URL:", response.data.authUrl);
        window.location.href = response.data.authUrl; // ✅ Google 로그인 페이지로 이동
    } catch (error) {
        console.error("🚨 Google 로그인 URL 요청 실패:", error);
        alert("Google 로그인 URL 요청 실패!");
    }
}

// ✅ Google OAuth 후 받은 인증 코드 처리 (백엔드로 전송)
async function handleOAuthCallback(code) {
    try {
        console.log("🔹 OAuth Callback 실행! Code:", code);
        const response = await axios.post("http://localhost:5000/api/auth/google", { code });

        console.log("🔹 백엔드 응답 확인:", response.data);

        if (response.data.needRegister) {
            console.log("🚀 회원가입이 필요함! `/register`로 이동.");
            localStorage.setItem("register_email", response.data.email);

            await nextTick();

            setTimeout(() => {
                router.push("/register"); // ✅ 100ms 후 강제 실행
            }, 100);
        } else if (response.data.jwtToken) {
            console.log("✅ 로그인 성공! JWT 저장 완료.");
            localStorage.setItem("token", response.data.jwtToken);
            router.push("/main");
        } else {
            alert("로그인 중 문제가 발생했습니다.");
            router.push("/login");
        }
    } catch (error) {
        console.error("🚨 로그인 실패:", error);
        alert("Google 로그인 실패!");
        router.push("/login");
    }
}


onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");


    console.log("🌐 현재 URL:", window.location.href); // ✅ 현재 URL 확인
    console.log("📌 `code` 값 확인:", code ? code : "❌ 없음!");


    if (code) {
        handleOAuthCallback(code);
    }
});
</script>

<template>
    <div>
        <h1>Google 로그인</h1>
        <button @click="googleLogin">Google 로그인</button>
    </div>
</template>
