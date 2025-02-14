<template>
    <div>
        <p v-if="authStore.isAuthenticated">로그인됨: {{ authStore.user.name }}</p>
        <button v-if="!authStore.isAuthenticated" @click="handleLogin">로그인</button>
        <button v-else @click="authStore.logout">로그아웃</button>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";

export default {
    setup() {
        const authStore = useAuthStore();

        function handleLogin() {
            authStore.login({ name: "홍길동", email: "hong@example.com" });
        }

        return { authStore, handleLogin };
    }
};


</script>