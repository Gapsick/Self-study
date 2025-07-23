<!-- login.vue -->
<template>
    <div>로그인 Page</div>
    <br><br>
    <button @click="googleURL">로그인</button>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from "axios";

onMounted(() => {
    // accessToken 있는지 여부 확인
    const accessToken = localStorage.getItem("accessToken");

    // 있는 경우
    if (accessToken) {
        haveToken();
    } else {  // 없는경우 + 검증 완료된 경우 -> refreshToken 확인
        noToken();
    }


})

// jwt token이 있는경우 실행되는 함수
async function haveToken() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get('http://localhost:3000/auth', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        })

        console.log(response.data);

        // 토큰이 있는경우 main으로 감
        console.log("main으로 감 - 추후 구현 예정")

    } catch (e) {
        // error인 경우
        console.log(e);
        // 실패시 noToken() 실행
        noToken();
    }
}

// jwt token이 없는경우 실행되는 함수
async function noToken() {
    try {
        const response = await axios.get('http://localhost:3000/auth/refresh', {
            withCredentials: true
        })
        // jwt 재발급 했을 경우
        console.log(response.data);
        // localStorage에 저장
        localStorage.setItem("accessToken", response.data.data)
        // main으로 이동
        window.location.href = 'http://localhost:5173/main'

    } catch (e) {
        console.log(e);
    }
}




async function googleURL() {
    // Google Login pop창 열기
    window.open("http://localhost:3000/auth/login", "_blank", "width=600,height=800")

    // 백엔드에서 오는 json 받기
    window.addEventListener("message", (event) => {

        // 백엔드에서 온 data가 아닌 경우 무시
        if (event.origin !== "http://localhost:3000") return;

        // 결과값 저장
        const { success, message, data, code } = event.data;

        // 1. 결과가 참인 경우
        if (success) {
            // 1-1. 회원가입이 필요한 경우
            if (message == "회원가입필요") {
                return window.location.href = 'http://localhost:5173/register';
            }
            // 1-2. 승인 대기중인 경우
            if (message == "승인대기중") {
                return alert("승인 대기중 입니다.");
            }
            // 1-3 정상적으로 발급 받은 경우
            if (message == "승인됨") {
                // JWT Token localStorage에 저장
                localStorage.setItem("accessToken", data)
                return window.location.href = 'http://localhost:5173/main';
            }
        } else {    // 2. 결과가 False인 경우
            return alert("다시 시도해주세요");
        }
    });



}


</script>