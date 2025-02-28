<template>
  <div>
    <h2>공지사항</h2>

    <!-- 🔎 검색 입력창 -->
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="검색어를 입력하세요" 
      @keyup.enter="performSearch" 
      style="margin-bottom: 10px; padding: 5px; width: 200px;"
    />
    <button @click="performSearch" style="margin-left: 10px; padding: 5px;">검색</button>
    <button @click="resetFilters" style="margin-left: 10px; padding: 5px; background-color: #f44336; color: white; border: none; cursor: pointer;">
      초기화
    </button>

    <!-- 🔹 공지사항 작성 버튼 (admin & professor만 표시) -->
    <button v-if="isAdmin" @click="goToWritePage" class="write-btn">공지사항 작성</button>

    <!-- 🔹 학년 선택 버튼 -->
    <div>
      <button @click="selectYear('전체')">전체</button>
      <button @click="selectYear(1)">1학년</button>
      <button @click="selectYear(2)">2학년</button>
      <button @click="selectYear(3)">3학년</button>
    </div>

    <!-- 🔹 과목 선택 드롭다운 -->
    <label>과목 선택: </label>
    <select v-model="selectedSubject">
      <option value="전체">전체</option>
      <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
        {{ subject.name }}
      </option>
    </select>

    <!-- 🔹 공지사항 테이블 -->
    <table>
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
        <tr v-for="notice in sortedNotices" :key="notice.id">
          <td>{{ notice.id }}</td>
          <td>
            <span v-if="notice.is_pinned">📌</span> <!-- 🔹 고정된 공지사항 아이콘 추가 -->
            {{ notice.title }}
          </td>
          <td>{{ notice.academic_year ? `${notice.academic_year}학년` : "전체" }}</td>
          <td>{{ getSubjectName(notice.subject_id) }}</td>
          <td>{{ notice.author || "미정" }}</td>
          <td>{{ formatDate(notice.created_at) }}</td>
          <td>{{ notice.views }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect } from "vue";
import { fetchNotices } from "@/api/noticeApi";
import { fetchSubjectsByYear } from "@/api/subjectApi";
import { useRouter } from "vue-router";

export default {
  setup() {
    const notices = ref([]);  // 공지사항 데이터
    const subjects = ref([]); // 과목 데이터
    const searchQuery = ref(""); // 검색어
    const selectedYear = ref("전체");
    const selectedSubject = ref("전체");

    // 🔹 Vue Router 사용
    const router = useRouter(); // ✅ Vue Router 인스턴스 생성    

    // 🔹 사용자 역할 가져오기
    const userRole = ref(localStorage.getItem("role"));  // ✅ 직접 localStorage에서 가져오기
    const isAdmin = ref(userRole.value === "admin" || userRole.value === "professor");

    console.log("📢 (Notice.vue) localStorage에서 가져온 역할:", userRole.value);
    console.log("🔹 (Notice.vue) 최종 isAdmin 상태:", isAdmin.value);

    // 🔹 공지사항 데이터 가져오기
    onMounted(async () => {
      try {
        notices.value = await fetchNotices();
        subjects.value = await fetchSubjectsByYear(selectedYear.value);
      } catch (error) {
        console.error("🚨 공지사항 목록 불러오기 실패:", error);
      }
    });

    // 🔹 작성 페이지로 이동 (Vue Router 사용)
    const goToWritePage = () => {
      router.push("/notices/write"); // ✅ Vue Router로 페이지 이동
    };

    // 🔹 학년 변경 시 해당 학년 과목 불러오기
    const selectYear = async (year) => {
      selectedYear.value = year;
      selectedSubject.value = "전체"; // 과목도 초기화
      try {
        subjects.value = await fetchSubjectsByYear(year);
        console.log("📚 학년별 과목 데이터:", subjects.value);
      } catch (error) {
        console.error("🚨 학년별 과목 불러오기 실패:", error);
      }
    };

    // ✅ `watchEffect()`를 사용하여 `filteredSubjects` 자동 업데이트
    const filteredSubjects = ref([]);
    watchEffect(() => {
      if (selectedYear.value === "전체") {
        filteredSubjects.value = subjects.value;
      } else {
        filteredSubjects.value = subjects.value.filter(
          subject => Number(subject.academic_year) === Number(selectedYear.value)
        );
      }
    });

    // 🔹 정렬된 공지사항 목록 (고정된 공지사항을 맨 위에 표시)
    const sortedNotices = computed(() => {
      let filtered = notices.value;

      // 고정된 공지사항 우선 표시
      filtered.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // 학년 필터
      if (selectedYear.value !== "전체") {
        filtered = filtered.filter(notice => notice.academic_year == selectedYear.value);
      }

      // 과목 필터
      if (selectedSubject.value !== "전체") {
        filtered = filtered.filter(notice => notice.subject_id == selectedSubject.value);
      }

      // 검색 필터
      if (searchQuery.value.trim() !== "") {
        filtered = filtered.filter(notice =>
          notice.title.includes(searchQuery.value) || 
          notice.content.includes(searchQuery.value)
        );
      }

      return filtered;
    });

    // 🔹 검색 실행 함수
    const performSearch = () => {
      searchQuery.value = searchQuery.value.trim(); // 불필요한 공백 제거
    };

    // 🔹 초기화 함수
    const resetFilters = () => {
      searchQuery.value = "";  // 검색어 초기화
      selectedYear.value = "전체";  // 학년 초기화
      selectedSubject.value = "전체";  // 과목 초기화
    };

    // 🔹 과목 ID를 이름으로 변환하는 함수
    const getSubjectName = (subjectId) => {
      const subject = subjects.value.find(subj => subj.id == subjectId);
      return subject ? subject.name : "알 수 없음";
    };

    // 🔹 날짜 포맷 함수
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
    };

    return {
      notices,
      subjects,
      searchQuery,
      selectedYear,
      selectedSubject,
      filteredSubjects,
      sortedNotices,
      getSubjectName,
      formatDate,
      selectYear,
      performSearch,
      resetFilters,
      isAdmin,
      goToWritePage,
    };
  }
};
</script>
