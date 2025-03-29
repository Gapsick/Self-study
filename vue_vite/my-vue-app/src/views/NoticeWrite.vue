<template>
  <div class="notice-write-container">
    <h2>공지사항 작성</h2>
    <form @submit.prevent="submitForm">
      <!-- 제목 -->
      <div class="form-group">
        <label for="title">제목</label>
        <input id="title" type="text" v-model="noticeData.title" required />
      </div>

      <!-- 내용 -->
      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="noticeData.content" required></textarea>
      </div>

      <!-- 분류 선택 (정규 or 특강) -->
      <div class="form-group">
        <label for="category">분류</label>
        <select id="category" v-model="noticeData.category">
          <option value="학과">정규 과목</option>
          <option value="과목별">특강</option>
        </select>
      </div>

      <!-- 학년 -->
      <div class="form-group" v-if="noticeData.category === '학과'">
        <label for="year">학년</label>
        <select id="year" v-model="selectedYear">
          <option value="전체">전체</option>
          <option v-for="year in [1, 2, 3]" :key="year" :value="year">
            {{ year }}학년
          </option>
        </select>
      </div>

      <!-- 과목 -->
      <div class="form-group" v-if="filteredSubjects.length > 0">
        <label for="subject">과목</label>
        <select id="subject" v-model="noticeData.subject_id">
          <option value="">과목 선택</option>
          <option
            v-for="subject in filteredSubjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.name }}
          </option>
        </select>
      </div>

      <!-- 파일 첨부 -->
      <div class="form-group">
        <label>파일 첨부</label>
        <div class="file-upload-box" v-if="fileName">
          <span class="file-name" :title="fileName">📄 {{ fileName }}</span>
          <button type="button" class="file-remove-btn" @click="removeFile">
            ❌
          </button>
        </div>
        <label for="file-upload" class="file-label">📁 파일 선택</label>
        <input id="file-upload" type="file" @change="handleFileUpload" hidden />
      </div>

      <!-- 공지 고정 -->
      <div class="form-group switch-container">
        <label for="pin">공지 고정</label>
        <input id="pin" type="checkbox" v-model="noticeData.is_pinned" />
      </div>

      <div class="button-group">
        <button type="submit" class="submit-btn">작성</button>
        <button type="button" class="cancel-btn" @click="cancelWrite">취소</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useNoticeForm } from "@/composables/useNoticeForm";
import { useSubjects } from "@/composables/useSubjects";
import { useRouter } from "vue-router";

const { noticeData, handleFileUpload: realFileUpload, createNotice } = useNoticeForm();
const router = useRouter();

const selectedYear = ref("전체");
const { subjects, loadSubjects } = useSubjects(selectedYear);
const fileName = ref("");

// ✅ 과목 필터링: 정규(학년 기준) vs 특강(전체)
const filteredSubjects = computed(() => {
  if (noticeData.value.category === "과목별") {
    return subjects.value.filter((s) => s.category === "특강");
  }
  return subjects.value.filter(
    (s) => s.category === "정규" && s.academic_year == selectedYear.value
  );
});

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    fileName.value = file.name;
    realFileUpload(e);
  }
};

const removeFile = () => {
  fileName.value = "";
  document.getElementById("file-upload").value = null;
};

onMounted(async () => {
  noticeData.value.category = "학과"; // 기본값은 정규
  await loadSubjects();
});

watch(selectedYear, async () => {
  await loadSubjects();
  noticeData.value.academic_year =
    selectedYear.value === "전체" ? null : Number(selectedYear.value);
});

const cancelWrite = () => {
  if (confirm("작성을 취소하시겠습니까? 작성한 내용은 저장되지 않습니다.")) {
    router.push("/notices");
  }
};

const submitForm = async () => {
  const success = await createNotice();
  if (success) {
    alert("공지사항이 작성되었습니다.");
    router.push("/notices");
  }
};
</script>


<style scoped>
.notice-write-container {
  max-width: 800px;
  margin: 100px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background-color: #1d4ed8;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.button-group {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  background-color: #9ca3af;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.cancel-btn:hover {
  background-color: #6b7280;
}


/* ✅ 파일 업로드 */
.file-upload-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
  max-width: 100%;
  overflow: hidden;
}

.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333;
}

.file-remove-btn {
  background: none;
  border: none;
  color: #d32f2f;
  font-size: 16px;
  cursor: pointer;
}

.file-label {
  display: inline-block;
  background-color: #1d4ed8;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

/* ✅ 스위치 */
.switch-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch-container input[type="checkbox"] {
  width: 40px;
  height: 20px;
  border-radius: 50px;
  appearance: none;
  background-color: #ccc;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch-container input[type="checkbox"]::before {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s ease;
}

.switch-container input[type="checkbox"]:checked {
  background-color: #4caf50;
}

.switch-container input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #1d4ed8;
}
</style>
