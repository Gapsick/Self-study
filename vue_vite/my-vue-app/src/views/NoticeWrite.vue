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

        <!-- 고정 여부 체크박스 추가 -->
        <div>
        <label>고정 여부</label>
        <input type="checkbox" v-model="noticeData.is_pinned" />
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
  
        <button type="submit">작성</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { postNotice } from "@/api/noticeApi";
  import { fetchSubjects } from "@/api/subjectApi";
  
  export default {
    setup() {
      const subjects = ref([]);
      const filteredSubjects = ref([]); // 학년별 과목 필터링
      const selectedYear = ref("전체"); // ✅ 기본값: 전체
      const noticeData = ref({
        title: "",
        content: "",
        academic_year: null, // ✅ 기본값 null
        subject_id: null,
        is_pinned: false,
      });
  
      // ✅ `localStorage.getItem("role")`을 직접 사용하여 userRole 가져오기
      const userRole = ref(localStorage.getItem("role"));
      const isAdmin = ref(userRole.value === "admin" || userRole.value === "professor");
  
      console.log("📢 (NoticeWrite.vue) localStorage에서 가져온 역할:", userRole.value);
      console.log("🔹 (NoticeWrite.vue) 최종 isAdmin 상태:", isAdmin.value);
  
      // 🔹 과목 목록 가져오기
      onMounted(async () => {
        try {
          subjects.value = await fetchSubjects();
          console.log("📚 (NoticeWrite.vue) fetchSubjects() 응답:", subjects.value);
          updateAcademicYear(); // ✅ 초기 필터 적용
        } catch (error) {
          console.error("❌ (NoticeWrite.vue) 과목 목록 가져오기 실패:", error);
        }
      });
  
      // 🔹 학년 선택 시 `academic_year` 업데이트
      const updateAcademicYear = () => {
        if (selectedYear.value === "전체") {
          noticeData.value.academic_year = null; // ✅ 전체 선택 시 null
        } else {
          noticeData.value.academic_year = Number(selectedYear.value); // ✅ 선택된 학년 값 저장
        }
        filterSubjects();
      };
  
      // 🔹 학년 선택 시 해당 학년의 과목만 필터링
      const filterSubjects = () => {
        if (selectedYear.value === "전체") {
          filteredSubjects.value = []; // ✅ 전체 선택 시 과목 숨김
        } else {
          filteredSubjects.value = subjects.value.filter(
            (subject) => subject.academic_year == selectedYear.value
          );
        }
        console.log("📚 (NoticeWrite.vue) 필터링된 과목 목록:", filteredSubjects.value);
      };
  
      // 🔹 공지사항 작성 요청
      const submitNotice = async () => {
    if (userRole.value === "student") {
        alert("학생은 공지사항을 작성할 수 없습니다.");
        return;
    }

    // 🔹 학년 값 변환 ("전체" 선택 시 null, 숫자는 그대로 유지)
    if (selectedYear.value === "전체") {
        noticeData.value.academic_year = null;
    } else {
        noticeData.value.academic_year = parseInt(selectedYear.value);
    }

    console.log("📢 (NoticeWrite.vue) 최종 전송할 데이터:", JSON.stringify(noticeData.value, null, 2));
    console.log("📢 (NoticeWrite.vue) academic_year 타입:", typeof noticeData.value.academic_year);

    try {
        const response = await postNotice(noticeData.value);
        
        if (response.error) {
            console.error("❌ (NoticeWrite.vue) 공지사항 작성 실패:", response.error);
            alert(`공지사항 작성 실패: ${response.error}`);
            return;
        }

        alert("공지사항이 작성되었습니다.");
        window.location.href = "/notices";
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
      };
    }
  };
  </script>
  