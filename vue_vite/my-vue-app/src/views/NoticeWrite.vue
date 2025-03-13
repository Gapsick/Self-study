<template>
  <div>
    <br><br><br><br>
    <h2>공지사항 작성</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>제목</label>
        <input type="text" v-model="noticeData.title" required />
      </div>

      <div>
        <label>내용</label>
        <textarea v-model="noticeData.content" required></textarea>
      </div>

      <!-- 🔹 학년 선택 -->
      <div>
        <label>학년</label>
        <select v-model="selectedYear">
          <option value="전체">전체</option>
          <option v-for="year in [1, 2, 3]" :key="year" :value="year">
            {{ year }}학년
          </option>
        </select>
      </div>

      <!-- 🔹 과목 선택 (학년이 '전체'가 아닐 때만 표시) -->
<!-- ✅ 조건문에서 .value 제거 -->
<div v-if="selectedYear !== '전체' && subjects.length > 0">
  <label>과목</label>
  <select v-model="noticeData.subject_id" :key="selectedYear">
    <option value="">과목 선택</option>
    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
      {{ subject.name }}
    </option>
  </select>
</div>
      <div>
        <label>파일 첨부</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <div>
        <label>공지 고정</label>
        <input type="checkbox" v-model="noticeData.is_pinned" />
      </div>

      <button type="submit">작성</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useNoticeForm } from "@/composables/useNoticeForm";
import { useSubjects } from "@/composables/useSubjects";
import { useRouter } from "vue-router";

const { noticeData, handleFileUpload, submitNotice } = useNoticeForm();
const router = useRouter();

// ✅ 학년 선택 변수
const selectedYear = ref("전체");

// ✅ 학년별 과목 목록 가져오기
const { subjects, loadSubjects } = useSubjects(selectedYear);

// 🔹 컴포넌트가 마운트되면 과목 목록 불러오기
onMounted(async () => {
  console.log("📢 컴포넌트 마운트됨 - 과목 데이터 로딩 시작");
  await loadSubjects();
});

// 🔹 학년이 변경될 때마다 과목 목록 다시 불러오기
watch(selectedYear, async () => {
  console.log("📢 학년 변경 감지됨:", selectedYear.value);
  await loadSubjects();

  // ✅ 학년 값 업데이트 보장
  noticeData.value.academic_year = selectedYear.value === "전체" ? null : Number(selectedYear.value);
  
  console.log("📌 업데이트된 noticeData.academic_year:", noticeData.value.academic_year);
});


// 🔹 공지사항 제출 함수
const submitForm = async () => {
  const success = await submitNotice();
  if (success) {
    alert("공지사항이 작성되었습니다.");
    router.push("/notices");
  }
};
</script>
