<template>
  <div>
    <h2>공지사항</h2>

    <NoticeFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedYear="selectedYear"
      v-model:selectedSubject="selectedSubject"
      :subjects="subjects.value"
    />

    <button v-if="isAdmin" @click="goToWritePage" class="write-btn">공지사항 작성</button>

    <table v-if="!isLoading">
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
            <router-link :to="`/notices/${notice.id}`">{{ notice.title }}</router-link>
          </td>
          <td>{{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</td>
          <td>{{ getSubjectName(notice.subject_id) }}</td>
          <td>{{ notice.author ? notice.author : "관리자" }}</td>
          <td>{{ formatDate(notice.created_at) }}</td>
          <td>{{ notice.views || 0}}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="isLoading">⏳ 로딩 중...</p>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useNoticeStore } from "@/stores/useNoticeStore";
import { useNoticeFilters } from "@/composables/useNoticeFilters";
import { useAuth } from "@/composables/useAuth";
import { useSubjects } from "@/composables/useSubjects";
import { formatDate } from "@/utils/formatUtils";
import { useRouter } from "vue-router";
import NoticeFilters from "@/components/NoticeFilters.vue";

export default {
  components: { NoticeFilters },
  setup() {
    const router = useRouter();
    const noticeStore = useNoticeStore();
    const { notices } = storeToRefs(noticeStore);
    const { searchQuery, selectedYear, selectedSubject, filterNotices } = useNoticeFilters(notices);
    const { subjects } = useSubjects(selectedYear);
    const { isAdmin } = useAuth();

    const isLoading = ref(true);

    // 🔹 공지사항 데이터 불러오기
    onMounted(async () => {
      await noticeStore.getNotices();
    });

    // 🔹 notices가 업데이트되면 isLoading을 false로 변경
    watchEffect(() => {
      if (notices.value.length > 0) {
        isLoading.value = false;
      }
      
      console.log("📢 subjects 값:", subjects.value); // ✅ subjects 값 확인
    });

    const getSubjectName = (subjectId) => {
  if (!subjectId) return "공통"; // 전체 공지일 경우 "공통" 표시
  if (!subjects.value || subjects.value.length === 0) {
    console.warn("📌 subjects가 아직 로드되지 않음.");
    return "로딩 중..."; 
  }
  
  const subject = subjects.value.find(subj => subj.id == subjectId);
  return subject ? subject.name : ""; // 과목 정보가 없으면 빈 값
};



    const goToWritePage = () => {
      router.push("/notices/write");
    };

    return {
      searchQuery,
      selectedYear,
      selectedSubject,
      filterNotices,
      formatDate,
      goToWritePage,
      subjects,
      isAdmin,
      isLoading,
      getSubjectName, // ✅ getSubjectName 추가
    };
  },
};
</script>

