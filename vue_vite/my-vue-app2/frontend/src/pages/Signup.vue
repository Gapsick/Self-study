<template>
    <div class="signup-container">
      <h2>회원가입</h2>
      <form @submit.prevent="handleSignup">
        <label>이름:</label>
        <input type="text" v-model="name" required />
  
        <label>전화번호:</label>
        <input type="text" v-model="phone" required />
  
        <label>역할:</label>
        <select v-model="role" required>
          <option value="student">학생</option>
          <option value="professor">교수</option>
          <option value="admin">관리자</option>
        </select>
  
        <!-- ✅ 학생일 경우 학번/학년 입력 필드 표시 -->
        <div v-if="role === 'student'">
          <label>학번:</label>
          <input type="text" v-model="student_id" required />
  
          <label>학년:</label>
          <select v-model="grade" required>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
        </div>
  
        <button type="submit">회원가입</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { signup } from "@/api/auth";
  import { useRoute, useRouter } from "vue-router";
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
  
      const email = ref(route.query.email || ""); // ✅ Google 로그인 후 전달된 이메일
      const name = ref("");
      const phone = ref("");
      const role = ref("student");
      const student_id = ref("");
      const grade = ref("");
  
      const handleSignup = async () => {
        try {
          const userData = { 
            email: email.value, 
            name: name.value, 
            phone: phone.value, 
            role: role.value,
            student_id: role.value === "student" ? student_id.value : null, // 학생만 입력
            grade: role.value === "student" ? grade.value : null // 학생만 입력
          };
  
          await signup(userData); // ✅ 회원가입 요청
          router.push("/Login"); // ✅ 승인 대기 페이지로 이동
        } catch (error) {
          console.error("회원가입 실패:", error);
        }
      };
  
      return { name, phone, role, student_id, grade, handleSignup };
    },
  };
  </script>
  
  <style scoped>
  .signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  
  input,
  select,
  button {
    margin-top: 10px;
    padding: 8px;
  }
  </style>
  