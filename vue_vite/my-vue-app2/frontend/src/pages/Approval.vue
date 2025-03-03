<template>
    <div class="approval-container">
      <h1>사용자 승인 관리</h1>
      <table>
        <thead>
          <tr>
            <th>이메일</th>
            <th>이름</th>
            <th>승인</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pendingUsers" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ user.name }}</td>
            <td>
              <button @click="approveUser(user.id)">승인</button>
              <button @click="rejectUser(user.id)">거부</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const pendingUsers = ref([]);
  
      // ✅ 승인 대기 사용자 목록 가져오기
      const fetchPendingUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/admin/pending-users");
          pendingUsers.value = response.data;
        } catch (error) {
          console.error("승인 대기 사용자 목록을 가져오는 중 오류 발생:", error);
        }
      };
  
      // ✅ 사용자 승인
      const approveUser = async (userId) => {
        try {
          await axios.post("http://localhost:5000/api/admin/approve", { userId });
          alert("사용자가 승인되었습니다.");
          fetchPendingUsers(); // 목록 갱신
        } catch (error) {
          console.error("사용자 승인 중 오류 발생:", error);
        }
      };
  
      // ✅ 사용자 거부
      const rejectUser = async (userId) => {
        try {
          await axios.post("http://localhost:5000/api/admin/reject", { userId });
          alert("사용자가 거부되었습니다.");
          fetchPendingUsers(); // 목록 갱신
        } catch (error) {
          console.error("사용자 거부 중 오류 발생:", error);
        }
      };
  
      onMounted(fetchPendingUsers);
  
      return { pendingUsers, approveUser, rejectUser };
    },
  };
  </script>
  
  <style scoped>
  .approval-container {
    text-align: center;
    margin-top: 50px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    border: 1px solid black;
    padding: 10px;
    text-align: center;
  }
  button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  