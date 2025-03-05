<template>
  <div>
    <h2>공지사항 상세보기</h2>
    <div v-if="notice">
      <h3>{{ notice.title || "제목 없음" }}</h3>
      <p>{{ notice.content || "내용 없음" }}</p>
      <p><strong>학년:</strong> {{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</p>
      <p v-if="notice.academic_year !== '전체' && notice.subject_id"><strong>과목:</strong> {{ getSubjectName(notice.subject_id) }}</p>
      <p><strong>작성일:</strong> {{ formattedDate }}</p>
      <p><strong>조회수:</strong> {{ notice.views || 0 }}</p>

      <div v-if="notice.file_path">
      <p><strong>첨부파일:</strong></p>
      <button @click="downloadFile">
        📂 {{ getFileName(notice.file_path) }}
      </button>
    </div>


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
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeDetail, deleteNotice } from "@/api/noticeApi";
import { useSubjects } from "@/composables/useSubjects";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref(null);
    const noticeId = route.params.id;
    const selectedYear = ref(""); // 학년 정보 저장
    const { subjects } = useSubjects(selectedYear);

    const userRole = ref(localStorage.getItem("role"));
    const isAdmin = computed(() => userRole.value === "admin" || userRole.value === "professor");

    // 🔹 공지사항 상세 정보 가져오기
    onMounted(async () => {
      const data = await fetchNoticeDetail(noticeId);
      if (data) {
        notice.value = data;
        selectedYear.value = data.academic_year || ""; // 학년에 맞는 과목 불러오기
        console.log("📢 현재 notice 데이터:", notice.value);
      } else {
        console.warn("⚠️ 공지사항 데이터를 불러오지 못했습니다.");
      }
    });

    // 🔹 subjects 데이터가 업데이트될 때마다 확인
    watchEffect(() => {
      console.log("📢 subjects 값:", subjects.value);
    });

    // ✅ 과목명 변환 (notice.vue와 동일한 방식 적용)
    const getSubjectName = (subjectId) => {
      if (!subjects.value || subjects.value.length === 0) {
        console.warn("📌 subjects가 아직 로드되지 않음.");
        return "로딩 중..."; // ✅ subjects가 아직 로드되지 않은 경우 예외 처리
      }

      const subject = subjects.value.find(subj => subj.id == subjectId);
      return subject ? subject.name : "알 수 없음";
    };

    const formattedDate = computed(() => {
      if (!notice.value || !notice.value.created_at) return "날짜 없음";
      const date = new Date(notice.value.created_at);
      return isNaN(date.getTime()) ? "날짜 없음" : `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
    });

    const goBack = () => {
      router.push("/notices");
    };

    const deleteNoticeHandler = async () => {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      const response = await deleteNotice(noticeId);
      if (response.error) {
        alert("삭제 실패: " + response.error);
        return;
      }
      alert("공지사항이 삭제되었습니다.");
      router.push("/notices");
    };

    const editNotice = () => {
      router.push(`/notices/edit/${noticeId}`);
    };

    // ✅ 파일 이름 추출 함수 추가
    const getFileName = (filePath) => {
      if (!filePath) return "파일 없음";
      return filePath.split("/").pop(); // 파일 경로에서 파일명만 추출
    };

    const downloadFile = () => {
    const fileUrl = `http://localhost:5000/${notice.value.file_path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", getFileName(notice.value.file_path)); // ✅ 다운로드 속성 추가
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


    return {
      notice,
      formattedDate,
      isAdmin,
      goBack,
      getSubjectName,
      deleteNotice: deleteNoticeHandler,
      editNotice,
      getFileName,
      downloadFile,
    };
  },
};
</script>