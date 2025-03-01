<template>
  <div>
    <h2>공지사항 상세보기</h2>
    <div v-if="notice">
      <h3>{{ notice.title || "제목 없음" }}</h3>
      <p>{{ notice.content || "내용 없음" }}</p>
      <p><strong>학년:</strong> {{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</p>
      <p><strong>과목:</strong> {{ getSubjectName(notice.subject_id) }}</p>
      <p><strong>작성일:</strong> {{ formattedDate }}</p>

      <!-- 🔹 파일 다운로드 버튼 -->
      <div v-if="notice.file_path">
        <a :href="`http://localhost:5000/${notice.file_path}`" download>📂 파일 다운로드</a>
      </div>

      <!-- 🔹 수정 및 삭제 버튼 (관리자 또는 교수만 가능) -->
      <div v-if="isAdmin">
        <button @click="editNotice">✏️ 수정</button>
        <button @click="deleteNotice">🗑 삭제</button>
      </div>

      <button @click="goBack">🔙 목록으로</button>
    </div>
    <div v-else>
      <p>공지사항을 불러오는 중...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeDetail, deleteNotice } from "@/api/noticeApi";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref(null);
    const noticeId = route.params.id;

    const userRole = ref(localStorage.getItem("role"));
    const isAdmin = computed(() => userRole.value === "admin" || userRole.value === "professor");

    // 🔹 공지사항 상세 정보 가져오기
    onMounted(async () => {
      const data = await fetchNoticeDetail(noticeId);
      if (data) {
        notice.value = data;
      }
    });

    // ✅ 날짜 변환 함수
    const formattedDate = computed(() => {
      if (!notice.value || !notice.value.created_at) return "날짜 없음";
      const date = new Date(notice.value.created_at);
      return isNaN(date.getTime()) ? "날짜 없음" : `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
    });

    // ✅ 과목명 변환
    const getSubjectName = (subjectId) => {
      return subjectId ? `과목 ${subjectId}` : "전체";
    };

    // ✅ 뒤로가기
    const goBack = () => {
      router.push("/notices");
    };

    // ✅ 공지사항 삭제 기능
    const deleteNoticeHandler = async () => {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      const response = await deleteNotice(noticeId);
      if (response.error) {
        alert("삭제 실패: " + response.error);
        return;
      }

      alert("공지사항이 삭제되었습니다.");
      router.push("/notices"); // ✅ 삭제 후 목록으로 이동
    };

    // ✅ 공지사항 수정 페이지로 이동
    const editNotice = () => {
      router.push(`/notices/edit/${noticeId}`);
    };

    return {
      notice,
      formattedDate,
      isAdmin,
      goBack,
      getSubjectName,
      deleteNotice: deleteNoticeHandler, // ✅ 삭제 기능 연결
      editNotice, // ✅ 수정 기능 연결
    };
  },
};
</script>
