<template>
  <div>
    <h2>공지사항 수정</h2>
    <form @submit.prevent="updateNoticeData">
      <label>제목</label>
      <input type="text" v-model="notice.title" required />

      <label>내용</label>
      <textarea v-model="notice.content" required></textarea>

      <label>학년</label>
      <select v-model="notice.academic_year">
        <option value="">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <label>과목</label>
      <select v-model="notice.subject_id">
        <option value="">과목 선택</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
        </option>
      </select>

      <label>공지 고정</label>
      <input type="checkbox" v-model="notice.is_pinned" />

      <div v-if="notice.file_path">
        <p>기존 파일: <a :href="`http://localhost:5000/${notice.file_path}`" target="_blank">
          {{ getFileName(notice.file_path) }}
        </a></p>
        <button type="button" @click="removeExistingFile">파일 삭제</button>
      </div>

      <label>파일 업로드</label>
      <input type="file" @change="handleFileUpload" />

      <button type="submit">저장</button>
      <button type="button" @click="cancelEdit">취소</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeDetail, updateNotice } from "@/api/noticeApi";
import { useSubjects } from "@/composables/useSubjects";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref({});
    const newFile = ref(null);
    const removeFile = ref(false);
    const selectedYear = ref("");
    const { subjects, loadSubjects } = useSubjects(selectedYear);

    onMounted(async () => {
      const data = await fetchNoticeDetail(route.params.id);
      if (data) {
        notice.value = data;
        selectedYear.value = data.academic_year || "";
        await loadSubjects();
      }
    });

    watch(selectedYear, async () => {
      console.log("📢 학년 변경 감지됨:", selectedYear.value);
      await loadSubjects();
      console.log("📢 학년 변경 후 subjects 값:", subjects.value);
    });

    const handleFileUpload = (event) => {
      newFile.value = event.target.files[0];
      removeFile.value = false;
    };

    const removeExistingFile = () => {
      removeFile.value = true;
      notice.value.file_path = null;
    };

    const updateNoticeData = async () => {
      const formData = new FormData();
      formData.append("title", notice.value.title);
      formData.append("content", notice.value.content);
      formData.append("academic_year", notice.value.academic_year ? parseInt(notice.value.academic_year, 10) : "");
      formData.append("subject_id", notice.value.subject_id || "");
      formData.append("is_pinned", notice.value.is_pinned ? "1" : "0");

      if (newFile.value) {
        formData.append("file", newFile.value);
      }

      if (removeFile.value) {
        formData.append("removeFile", "true");
      }

      console.log("🚀 공지사항 수정 요청 데이터:", [...formData.entries()]);

      const response = await updateNotice(route.params.id, formData);
      if (!response.error) {
        alert("공지사항이 수정되었습니다.");
        router.push(`/notices/${route.params.id}`);
      } else {
        alert("수정 실패: " + response.error);
      }
    };

    const getFileName = (filePath) => filePath ? filePath.split("/").pop() : "";

    const cancelEdit = () => {
      router.push(`/notices/${route.params.id}`);
    };

    return {
      notice,
      subjects,
      selectedYear,
      newFile,
      removeFile,
      handleFileUpload,
      removeExistingFile,
      updateNoticeData,
      getFileName,
      cancelEdit,
    };
  },
};
</script>
