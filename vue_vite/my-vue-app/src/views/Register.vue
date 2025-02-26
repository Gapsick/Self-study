<template>
  <div class="register-container">
    <h2>회원가입 신청</h2>
    <form @submit.prevent="submitRegister">
      <label>이름</label>
      <input v-model="name" type="text" required />

      <label>학번</label>
      <input v-model="studentId" type="text" required />

      <label>전화번호</label>
      <input v-model="phone" type="text" required />

      <label>학년</label>
      <select v-model="grade">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <label>유학생 여부</label>
      <select v-model="isForeign">
        <option value="false">아니오</option>
        <option value="true">예</option>
      </select>

      <label>이메일</label>
      <input v-model="email" type="email" disabled />

      <button type="submit">회원가입 신청</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      name: "",
      studentId: "",
      phone: "",
      grade: "1",
      isForeign: "false",
      email: ""
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
    this.email = localStorage.getItem("register_email") || "";
  },
  methods: {
    async submitRegister() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          name: this.name,
          studentId: this.studentId,
          phone: this.phone,
          grade: this.grade,
          isForeign: this.isForeign === "true",
          email: this.email
        });

        if (response.data.success) {
          alert("✅ 회원가입 신청 완료! 관리자의 승인을 기다려주세요.");
          localStorage.removeItem("register_email");
          this.router.push("/login"); // 로그인 페이지로 이동
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "❌ 회원가입 신청 실패!";
      }
    }
  }
};
</script>
