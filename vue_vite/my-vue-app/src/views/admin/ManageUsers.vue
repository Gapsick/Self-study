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
          <td>{{ user.grade !== undefined && user.grade !== null ? `${user.grade}학년` : '미지정' }}</td>
          <td>{{ user.is_foreign === 1 || user.is_foreign === true ? "예" : "아니오" }}</td>

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

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ 반응형 상태 선언
const pendingUsers = ref([]);
const errorMessage = ref("");

// ✅ 승인 대기 사용자 목록 가져오기
const fetchPendingUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/pending-users");
    console.log("✅ 받아온 대기 사용자 목록:", response.data);

    pendingUsers.value = response.data.users.map(user => ({
      ...user,
      selectedRole: "student" // 기본 역할 설정
    }));
  } catch (error) {
    console.error("❌ 대기 중인 사용자 목록 불러오기 실패:", error.response?.data || error.message);
    errorMessage.value = "❌ 대기 중인 사용자 목록을 불러오지 못했습니다.";
  }
};

// ✅ 회원 승인
const approveUser = async (user) => {
  try {
    const response = await axios.post("http://localhost:5000/api/admin/approve-user", {
      email: user.email,
      role: user.selectedRole
    });

    alert(response.data.message);
    await fetchPendingUsers(); // ✅ 승인 후 목록 업데이트
  } catch (error) {
    console.error("❌ 승인 실패:", error.response?.data || error.message);
    errorMessage.value = error.response?.data?.message || "❌ 승인 실패!";
  }
};

// ✅ 회원 거부
const rejectUser = async (user) => {
  try {
    const response = await axios.post("http://localhost:5000/api/admin/reject", {
      email: user.email
    });

    alert(response.data.message);
    pendingUsers.value = pendingUsers.value.filter(u => u.email !== user.email);
  } catch (error) {
    console.error("❌ 승인 거부 실패:", error.response?.data || error.message);
    errorMessage.value = error.response?.data?.message || "❌ 승인 거부 실패!";
  }
};

// ✅ 컴포넌트가 로드될 때 승인 대기 사용자 목록 불러오기
onMounted(fetchPendingUsers);
</script>

<style scoped>
.admin-container {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  margin-top: 30px;
  font-family: 'Noto Sans KR', sans-serif;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

/* 제목 */
.admin-container h2 {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
}

/* 테이블 전체 */
table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: auto; /* 또는 fixed */
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* 헤더 셀 */
thead th {
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 14px 16px;  /* ✅ 패딩 여유 */
  font-size: 14px;
  text-align: center;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
}

/* 바디 셀 */
tbody td {
  padding: 12px 16px;
  font-size: 13px;
  color: #333;
  text-align: center;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
}

/* 드롭다운 */
select {
  padding: 6px 8px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  appearance: none;
}

/* 버튼 */
button {
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  margin-right: 6px;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #2563eb;
}

/* 거절 버튼만 별도 색상 */
.reject-btn {
  background-color: #ef4444;
}
.reject-btn:hover {
  background-color: #dc2626;
}

/* 에러 메시지 */
.error-message {
  margin-top: 20px;
  color: #ef4444;
  font-weight: 500;
  font-size: 14px;
}
</style>
