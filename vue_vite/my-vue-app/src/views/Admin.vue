<template>
    <div class="admin-container">
      <h2>회원 승인 관리</h2>
  
      <table v-if="pendingUsers.length > 0">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>학번</th>
            <th>전화번호</th>
            <th>학년</th>
            <th>유학생 여부</th>
            <th>역할(Role)</th>
            <th>승인</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pendingUsers" :key="user.email">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.student_id }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.grade }}</td>
            <td>{{ user.is_foreign ? "예" : "아니오" }}</td>
  
            <!-- ✅ 역할 선택 -->
            <td>
              <select v-model="user.selectedRole">
                <option value="student">학생</option>
                <option value="professor">교수</option>
                <option value="admin">관리자</option>
              </select>
            </td>
  
            <td>
              <button @click="approveUser(user)">승인</button>
              <button @click="rejectUser(user)" class="reject-btn">거부</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-else class="error-message">⚠️ 승인 대기 중인 사용자가 없습니다.</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        pendingUsers: [],
        errorMessage: ""
      };
    },
    async created() {
      await this.fetchPendingUsers();
    },
    methods: {
      async fetchPendingUsers() {
        try {
          const response = await axios.get("http://localhost:5000/api/admin/pending-users");
          console.log("✅ 받아온 대기 사용자 목록:", response.data); // 👉 데이터 확인
  
          this.pendingUsers = response.data.users.map(user => ({
            ...user,
            selectedRole: "student" // 기본 역할 설정
          }));
        } catch (error) {
          console.error("❌ 대기 중인 사용자 목록 불러오기 실패:", error.response?.data || error.message);
          this.errorMessage = "❌ 대기 중인 사용자 목록을 불러오지 못했습니다.";
        }
      },
      async approveUser(user) {
        try {
          const response = await axios.post("http://localhost:5000/api/admin/approve-user", {
            email: user.email,
            role: user.selectedRole
          });
  
          alert(response.data.message);
          await this.fetchPendingUsers(); // ✅ 승인 후 목록 업데이트
        } catch (error) {
          console.error("❌ 승인 실패:", error.response?.data || error.message);
          this.errorMessage = error.response?.data?.message || "❌ 승인 실패!";
        }
      },
      async rejectUser(user) {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/reject", {
            email: user.email
            });

            alert(response.data.message);
            this.pendingUsers = this.pendingUsers.filter(u => u.email !== user.email);
        } catch (error) {
            console.error("❌ 승인 거부 실패:", error.response?.data || error.message);
            this.errorMessage = error.response?.data?.message || "❌ 승인 거부 실패!";
        }
      }
    }
  };
  </script>
  