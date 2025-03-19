<template>
  <br><br><br><br><br>
  <div>
    <h2>공지사항</h2>

    <NoticeFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedYear="selectedYear"
      v-model:selectedSubject="selectedSubject"
      :subjects="subjects"
    />

    <button v-if="isAdmin" @click="goToWritePage" class="write-btn">
      공지사항 작성
    </button>

    <p v-if="isLoading">⏳ 로딩 중...</p>

    <table v-else-if="filterNotices.length > 0">
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
            <span v-if="notice.is_pinned">📌</span>
            <router-link :to="`/notices/${notice.id}`">
              {{ notice.title }}
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

    <p v-else>📢 현재 등록된 공지사항이 없습니다.</p>
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

// ✅ 공지사항 데이터 불러오기
onMounted(async () => {
  isLoading.value = true; // ✅ 로딩 시작
  try {
    await noticeStore.getNotices();
  } catch (error) {
    console.error("🚨 공지사항 불러오기 실패:", error);
  } finally {
    isLoading.value = false; // ✅ 성공/실패와 관계없이 로딩 종료
  }
});

// ✅ notices와 subjects 로드 여부 확인
watchEffect(() => {
  isLoading.value = notices.value.length === 0 || subjects.value.length === 0;
  console.log("📢 Notice.vue에서 subjects 값:", subjects.value);
});

// ✅ 과목 ID를 과목 이름으로 변환
const getSubjectName = (subjectId) => {
  if (!subjectId) return "공통"; // ✅ 전체 공지일 경우 "공통" 표시

  if (!subjects.value || subjects.value.length === 0) {
    console.warn("📌 subjects가 아직 로드되지 않음.");
    return "로딩 중...";
  }

  // 🔹 전체일 경우 모든 subjects에서 찾기
  const subject = subjects.value.find((subj) => subj.id == subjectId);
  return subject ? subject.name : "알 수 없음"; // ✅ 과목 정보가 없으면 "알 수 없음"
};

// ✅ 공지사항 작성 페이지로 이동
const goToWritePage = () => {
  router.push("/notices/write");
};
</script>
