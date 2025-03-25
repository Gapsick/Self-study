<template>
  <div class="detail-container" v-if="notice">
    <div class="header">
      <h2 class="title">{{ notice.title || "제목 없음" }}</h2>
      <div class="meta">
        <p><strong>학년:</strong> {{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</p>
        <p><strong>작성일:</strong> {{ formattedDate }}</p>
        <p><strong>조회수:</strong> {{ notice.views || 0 }}</p>
      </div>
    </div>

    <hr class="divider" />

    <!-- ✅ 첨부파일을 본문보다 위로 이동 -->
    <div v-if="notice.file_path" class="file-box">
      <span>📎 첨부파일:</span>
      <button @click="downloadFile" class="file-download">
        {{ getFileName(notice.file_path) }}
      </button>
    </div>

    <div class="content">
      <p>{{ notice.content || "내용 없음" }}</p>
    </div>

    <div class="button-group">
      <button v-if="isAdmin" @click="editNotice" class="edit-btn">✏️ 수정</button>
      <button v-if="isAdmin" @click="deleteNotice" class="delete-btn">🗑 삭제</button>
      <button @click="goBack" class="back-btn">목록으로</button>
    </div>
  </div>

  <div v-else class="loading">📄 공지사항을 불러오는 중입니다...</div>
</template>


<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeDetail, deleteNotice } from "@/api/noticeApi";
import { useSubjects } from "@/composables/useSubjects";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref(null);
    const noticeId = route.params.id;
    const selectedYear = ref("");
    const { subjects } = useSubjects(selectedYear);
    const userRole = ref(localStorage.getItem("role"));
    const isAdmin = computed(() => userRole.value === "admin" || userRole.value === "professor");

    onMounted(async () => {
      try {
        const data = await fetchNoticeDetail(noticeId);
        if (data) {
          notice.value = data;
          selectedYear.value = data.academic_year || "";
        }
      } catch (e) {
        console.error("📛 공지사항 로딩 오류:", e);
      }
    });

    const getSubjectName = (subjectId) => {
      const subject = subjects.value.find(subj => subj.id == subjectId);
      return subject ? subject.name : "알 수 없음";
    };

    const formattedDate = computed(() => {
      if (!notice.value?.created_at) return "날짜 없음";
      const date = new Date(notice.value.created_at);
      return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
    });

    const downloadFile = () => {
      const fileUrl = `http://localhost:5000/${notice.value.file_path}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", getFileName(notice.value.file_path));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const getFileName = (filePath) => {
    const encodedName = filePath?.split("/").pop();
    const decoded = decodeURIComponent(encodedName || "");

    // ✅ 앞에 붙은 숫자- 제거
    const cleaned = decoded.replace(/^\d+-/, "");
    return cleaned || "파일 없음";
    };
    
    const goBack = () => router.push("/notices");
    const editNotice = () => router.push(`/notices/edit/${noticeId}`);
    const deleteNoticeHandler = async () => {
      if (confirm("정말 삭제하시겠습니까?")) {
        const response = await deleteNotice(noticeId);
        if (!response.error) {
          alert("공지사항이 삭제되었습니다.");
          router.push("/notices");
        }
      }
    };

    return {
      notice,
      formattedDate,
      isAdmin,
      goBack,
      editNotice,
      deleteNotice: deleteNoticeHandler,
      getFileName,
      downloadFile,
    };
  }
};
</script>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 80px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Noto Sans KR', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #111827;
  flex: 1;
  margin-bottom: 10px;
}

.meta {
  text-align: right;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.divider {
  margin: 16px 0 24px;
  border: none;
  height: 1px;
  background-color: #e5e7eb;
}

.content {
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 24px;
  white-space: pre-wrap;
}

.file-box {
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.file-download {
  background-color: #2563eb;
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.file-download:hover {
  background-color: #1d4ed8;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-btn,
.delete-btn,
.back-btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-btn {
  background-color: #facc15;
  color: black;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.back-btn {
  background-color: #1d4ed8;
  color: white;
}

.edit-btn:hover {
  background-color: #eab308;
}
.delete-btn:hover {
  background-color: #dc2626;
}
.back-btn:hover {
  background-color: #2563eb;
}
</style>