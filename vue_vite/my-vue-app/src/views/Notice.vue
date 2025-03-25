<template>
  <div class="notice-container">
    <div class="notice-header">
      <h2>📢 공지사항</h2>
      <button v-if="isAdmin" @click="goToWritePage" class="write-btn">+ 새 공지 작성</button>
    </div>

    <!-- 필터 + 새 공지 버튼 -->
    <div class="notice-filters">
      <NoticeFilters
        v-model:searchQuery="searchQuery"
        v-model:selectedYear="selectedYear"
        v-model:selectedSubject="selectedSubject"
        :subjects="subjects"
      />
    </div>

    <p v-if="isLoading" class="loading-text">🔄 공지사항을 불러오는 중입니다...</p>

    <table v-else-if="filterNotices.length > 0" class="notice-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>대상학년</th>
          <th>과목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="notice in filterNotices" :key="notice.id">
          <td>{{ notice.id }}</td>
          <td>
            <router-link :to="`/notices/${notice.id}`" class="notice-title-link">
              <strong>{{ notice.title }}</strong>
              <span v-if="notice.is_pinned" class="pin">📌</span>
            </router-link>
          </td>
          <td>{{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</td>
          <td>{{ getSubjectName(notice.subject_id) }}</td>
          <td>{{ notice.author || "관리자" }}</td>
          <td>{{ formatDate(notice.created_at) }}</td>
          <td>{{ notice.views || 0 }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty-text">📢 현재 등록된 공지사항이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useNoticeStore } from "@/stores/useNoticeStore";
import { useNoticeFilters } from "@/composables/useNoticeFilters";
import { useAuth } from "@/composables/useAuth";
import { useSubjects } from "@/composables/useSubjects";
import { formatDate } from "@/utils/formatUtils";
import { useRouter } from "vue-router";
import NoticeFilters from "@/components/NoticeFilters.vue";

const router = useRouter();
const noticeStore = useNoticeStore();
const { notices } = storeToRefs(noticeStore);
const { searchQuery, selectedYear, selectedSubject, filterNotices } = useNoticeFilters(notices);
const { subjects } = useSubjects(selectedYear);
const { isAdmin } = useAuth();
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    await noticeStore.getNotices();
  } catch (error) {
    console.error("🚨 공지사항 불러오기 실패:", error);
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  isLoading.value = notices.value.length === 0 || subjects.value.length === 0;
});

const getSubjectName = (subjectId) => {
  if (!subjectId) return "공통";
  if (!subjects.value || subjects.value.length === 0) return "로딩 중...";
  const subject = subjects.value.find((subj) => subj.id == subjectId);
  return subject ? subject.name : "알 수 없음";
};

const goToWritePage = () => {
  router.push("/notices/write");
};
</script>

<style scoped>
.notice-container {
  max-width: 1100px;
  margin: 80px auto 40px;
  padding: 0 20px;
  font-family: 'Noto Sans KR', sans-serif;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.write-btn {
  background-color: #1d4ed8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.write-btn:hover {
  background-color: #2563eb;
}

.notice-filters {
  display: flex;
  margin: 60px auto 40px;
  justify-content: flex-end; /* 검색창과 버튼을 오른쪽에 정렬 */
  align-items: center;
  gap: 12px;
  margin-bottom: 5px; /* 여유 공간 추가 */
}

.notice-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border-radius: 8px;
  overflow: hidden;
}

.notice-table th {
  background-color: #f9fafb;
  color: #374151;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.notice-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

.notice-table tr:hover {
  background-color: #f0f4ff;
}

.notice-title-link {
  color: #1d4ed8;
  text-decoration: none;
}

.notice-title-link:hover {
  text-decoration: underline;
}

.pin {
  margin-left: 6px;
}

.loading-text,
.empty-text {
  text-align: center;
  color: #888;
  margin-top: 40px;
  font-size: 16px;
}
</style>