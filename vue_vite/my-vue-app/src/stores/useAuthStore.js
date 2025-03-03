import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null, // ✅ JWT 토큰 저장
    userRole: localStorage.getItem("role") || null, // ✅ 유저 역할 저장
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // ✅ 로그인 여부 확인
    isAdmin: (state) => state.userRole === "admin" || state.userRole === "professor",
  },
  actions: {
    login(token, role) {
      this.token = token;
      this.userRole = role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },
    logout() {
      this.token = null;
      this.userRole = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
        this.userRole = localStorage.getItem("role");
      } else {
        this.token = null;
        this.userRole = null;
      }
    },
  },
});
