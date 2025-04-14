<template>
    <div>
      <h3>학생 특강 정보 수정</h3>
  
      <!-- 🔹 필터 버튼 -->
      <div class="filter-buttons">
        <button
          v-for="item in filters"
          :key="item.label"
          :class="{ active: selectedFilter === item.value }"
          @click="selectedFilter = item.value"
        >
          {{ item.label }}
        </button>
      </div>
  
      <!-- 🔹 학생 테이블 -->
      <table class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>레벨</th>
            <th>반</th>
            <th>저장</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
  
            <!-- 🔹 레벨 -->
            <td>
            <select v-model="user.level">
                <option disabled value="">선택</option>

                <!-- 유학생: TOPIK만 -->
                <template v-if="user.is_foreign === 1">
                <option value="TOPIK4">TOPIK4</option>
                <option value="TOPIK6">TOPIK6</option>
                </template>

                <!-- 내국인: 일본어 과정만 -->
                <template v-else>
                <option value="N1">N1</option>
                <option value="N2">N2</option>
                <option value="N3">N3</option>
                </template>
            </select>
            </td>

            <!-- 🔹 반: 유학생은 생략 -->
            <td v-if="user.is_foreign === 0">
              <select v-model="user.class_group">
                <option disabled value="null">선택</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="전체">전체</option>
              </select>
            </td>
            <td v-else>-</td>
  
            <!-- 🔹 저장 버튼 -->
            <td>
              <button
                :disabled="!user.level || (user.is_foreign === 0 && !user.class_group)"
                @click="saveUser(user)"
              >
                저장
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const users = ref([])
  const selectedFilter = ref(1)
  
  const filters = [
    { label: '1학년', value: 1 },
    { label: '2학년', value: 2 },
    { label: '3학년', value: 3 },
    { label: '유학생', value: 'foreign' }
  ]
  
  onMounted(async () => {
    const res = await axios.get('/api/admin/special-lecture-users')
    users.value = res.data
  })
  
  const filteredUsers = computed(() => {
    if (selectedFilter.value === 'foreign') {
      return users.value.filter(user => user.is_foreign === 1)
    }
    return users.value.filter(user => user.grade === selectedFilter.value && user.is_foreign === 0)
  })
  
  const saveUser = async (user) => {
    await axios.put(`/api/admin/special-lecture-users/${user.id}`, {
      level: user.level,
      class_group: user.is_foreign ? null : user.class_group
    })
    alert('저장되었습니다.')
  }
  </script>
  
  <style scoped>
  .filter-buttons {
    margin-bottom: 16px;
  }
  
  .filter-buttons button {
    margin-right: 10px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background-color: #e5e7eb;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .filter-buttons button.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .user-table th, .user-table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  .user-table select {
    padding: 6px;
    min-width: 100px;
  }
  button {
    padding: 6px 10px;
    border-radius: 6px;
  }
  </style>
  