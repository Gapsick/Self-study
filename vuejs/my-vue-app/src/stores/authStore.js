import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: false, // 로그인 상태
        user: null // 사용자 정보
    }),
    actions: {
        login(userData) {
            this.isAuthenticated = true;
            this.user = userData;
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
        }
    }
})