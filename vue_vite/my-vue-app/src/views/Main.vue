<template>
  <div class="main-wrapper">
    <div class="notice-container">
      <div class="notice-list">
        <h2>공지사항</h2>
        <ul>
          <li 
            v-for="notice in notices" 
            :key="notice.id"
            :class="{ active: selectedNotice && selectedNotice.id === notice.id }"
            @click="selectNotice(notice)"
          >
            {{ notice.title }}
          </li>
        </ul>
      </div>

      <div class="notice-detail" v-if="selectedNotice">
        <h3>{{ selectedNotice.title }}</h3>
        <p>{{ selectedNotice.content }}</p>
        <p class="date">{{ selectedNotice.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notices = ref([
  { id: 1, title: '중간고사 일정 공지', content: '중간고사는 3월 25일부터 시작됩니다.', date: '2025-03-10' },
  { id: 2, title: '1학기 수강 신청 안내', content: '수강신청은 3월 15일까지입니다.', date: '2025-03-05' },
  { id: 3, title: '학과 워크숍 공지', content: '워크숍은 4월 1일 개최 예정입니다.', date: '2025-03-01' },
])

const selectedNotice = ref(notices.value[0])

function selectNotice(notice) {
  selectedNotice.value = notice
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');

.main-wrapper {
  display: flex;
  justify-content: center;
  padding: 100px 16px 40px; /* ✅ 위쪽 여백 추가 */
  font-family: 'Noto Sans KR', sans-serif;
}


.notice-container {
  display: flex;
  width: 100%;
  max-width: 960px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.notice-list {
  flex: 1;
  max-width: 300px;
  border-right: 1px solid #e0e0e0;
  padding: 24px;
}

.notice-list h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #1e3a8a;
  font-weight: 600;
}

.notice-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
  color: #333;
}

.notice-list li:hover,
.notice-list li.active {
  background-color: #eef4ff;
  color: #1e40af;
  font-weight: 600;
}

.notice-detail {
  flex: 2;
  padding: 24px;
}

.notice-detail h3 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #111827;
  font-weight: 700;
}

.notice-detail p {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
}

.notice-detail .date {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 16px;
}
</style>
