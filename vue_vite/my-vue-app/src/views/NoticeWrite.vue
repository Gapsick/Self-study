<template>
  <div>
    <h2>공지사항 작성</h2>
    <form @submit.prevent="submitNotice">
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
        <select v-model="selectedYear" @change="updateAcademicYear">
          <option value="전체">전체</option>
          <option v-for="year in [1, 2, 3]" :key="year" :value="year">
            {{ year }}학년
          </option>
        </select>
      </div>

      <!-- 🔹 과목 선택 (전체 선택 시 숨김) -->
      <div v-if="selectedYear !== '전체'">
        <label>과목</label>
        <select v-model="noticeData.subject_id">
          <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>

      <!-- 🔹 파일 업로드 -->
      <div>
        <label>파일 첨부</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <!-- 🔹 공지 고정 여부 -->
      <div>
        <label>공지 고정</label>
        <input type="checkbox" v-model="noticeData.is_pinned" />
      </div>

      <button type="submit">작성</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { postNotice } from "@/api/noticeApi";
import { fetchSubjects } from "@/api/subjectApi";
import { useRouter } from "vue-router"; // ✅ 추가

export default {
  setup() {
    const router = useRouter();
    const subjects = ref([]);
    const filteredSubjects = ref([]);
    const selectedYear = ref("전체");

    const noticeData = ref({
      title: "",
      content: "",
      academic_year: null,
      subject_id: null,
      is_pinned: false,
      file: null,
    });

    // ✅ 사용자 역할 가져오기
    const userRole = ref(localStorage.getItem("role"));
    const isAdmin = ref(userRole.value === "admin" || userRole.value === "professor");

    console.log("📢 (NoticeWrite.vue) localStorage에서 가져온 역할:", userRole.value);
    console.log("🔹 (NoticeWrite.vue) 최종 isAdmin 상태:", isAdmin.value);

    // 🔹 과목 목록 가져오기
    onMounted(async () => {
      try {
        subjects.value = await fetchSubjects();
        updateAcademicYear(); // ✅ 초기 필터 적용
      } catch (error) {
        console.error("❌ (NoticeWrite.vue) 과목 목록 가져오기 실패:", error);
      }
    });

    // 🔹 학년 선택 시 과목 필터링
    const updateAcademicYear = () => {
      if (selectedYear.value === "전체") {
        noticeData.value.academic_year = null;
        filteredSubjects.value = []; // ✅ 전체 선택 시 과목 숨김
      } else {
        noticeData.value.academic_year = Number(selectedYear.value);
        filteredSubjects.value = subjects.value.filter(
          (subject) => subject.academic_year == selectedYear.value
        );
      }
      console.log("📚 (NoticeWrite.vue) 필터링된 과목 목록:", filteredSubjects.value);
    };

    // ✅ 파일 업로드 핸들러
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      noticeData.value.file = file;
      console.log("📂 (handleFileUpload) 선택한 파일:", noticeData.value.file);
    } else {
      noticeData.value.file = null;
      }
    };


    // 🔹 공지사항 작성 요청
    const submitNotice = async () => {
    if (userRole.value === "student") {
      alert("학생은 공지사항을 작성할 수 없습니다.");
      return;
    }

    // ✅ 학년 값 변환 ("전체" 선택 시 null, 숫자는 그대로 유지)
    noticeData.value.academic_year =
      selectedYear.value === "전체" ? null : Number(selectedYear.value);

    console.log("📢 (NoticeWrite.vue) 최종 전송할 데이터:", noticeData.value);

    // ✅ FormData 생성 (파일 유무와 관계없이 무조건 FormData 사용)
    const formData = new FormData();
    formData.append("title", noticeData.value.title);
    formData.append("content", noticeData.value.content);

    if (noticeData.value.academic_year !== null) {
      formData.append("academic_year", noticeData.value.academic_year);
    }
    if (noticeData.value.subject_id !== null) {
      formData.append("subject_id", noticeData.value.subject_id);
    }

    formData.append("is_pinned", noticeData.value.is_pinned ? "1" : "0");

    if (noticeData.value.file) {
    console.log("📂 (submitNotice) 추가할 파일:", noticeData.value.file.name);
    formData.append("file", noticeData.value.file);
    } else {
      console.log("⚠ (submitNotice) 선택된 파일이 없습니다.");
    }

      // ✅ FormData 값 확인
      console.log("📢 (NoticeWrite.vue) 최종 전송할 FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`📌 ${key}:`, value);
      }

    try {
      const response = await postNotice(formData);

      if (response.error) {
        console.error("❌ (NoticeWrite.vue) 공지사항 작성 실패:", response.error);
        alert(`공지사항 작성 실패: ${response.error}`);
        return;
      }

      alert("공지사항이 작성되었습니다.");
      router.push("/notices");
    } catch (error) {
      console.error("❌ (NoticeWrite.vue) 공지사항 작성 오류:", error);
      alert("공지사항 작성에 실패했습니다.");
    }
  };

    return {
      subjects,
      filteredSubjects,
      selectedYear,
      noticeData,
      isAdmin,
      submitNotice,
      updateAcademicYear,
      handleFileUpload, // ✅ 파일 업로드 핸들러 추가
    };
  },
};
</script>
