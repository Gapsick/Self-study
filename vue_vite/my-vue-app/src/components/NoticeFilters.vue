<template>
  <div>
    <!-- 🔎 검색 입력 -->
    <input
      type="text"
      v-model="searchText"
      placeholder="검색어 입력"
      @keyup.enter="emitSearch"
    />
    <button @click="emitSearch">검색</button>
    <button @click="emitReset">초기화</button>

    <!-- 🔹 학년 선택 (학생이면 자기 학년 + 전체, 아니면 전체 학년 선택 가능) -->
    <label>학년 선택:</label>
    <select v-model="localYear" @change="emitFilter">
      <option value="전체">전체</option>
      <option v-if="userRole === 'student'" :value="userGrade">
        {{ userGrade }}학년
      </option>
      <option v-if="userRole !== 'student'" value="1">1학년</option>
      <option v-if="userRole !== 'student'" value="2">2학년</option>
      <option v-if="userRole !== 'student'" value="3">3학년</option>
    </select>

    <!-- 🔹 과목 선택 -->
    <label>과목 선택:</label>
    <select v-model="localSubject" @change="emitFilter">
      <option value="전체">전체</option>
      <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
        {{ subject.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from "vue";

export default defineComponent({
  props: {
    searchQuery: String,
    selectedYear: String,
    selectedSubject: String,
    subjects: Array, // ✅ subjects를 props로 받음
  },
  setup(props, { emit }) {
    // ✅ 사용자 정보 가져오기
    const userRole = localStorage.getItem("role");
    const userGrade = parseInt(localStorage.getItem("grade") || "1"); // ✅ 숫자로 변환

    // ✅ 로컬 상태 추가
    const searchText = ref(props.searchQuery);
    const localYear = ref(props.selectedYear);
    const localSubject = ref(props.selectedSubject);

    // 🔹 검색 실행
    const emitSearch = () => {
      emit("update:searchQuery", searchText.value);
    };

    // 🔹 학년 및 과목 선택 변경
    const emitFilter = () => {
      emit("update:selectedYear", String(localYear.value));
      emit("update:selectedSubject", localSubject.value);
    };

    // 🔹 초기화
    const emitReset = () => {
      searchText.value = "";
      localYear.value = userRole === "student" ? "전체" : "전체"; // 학생도 전체 선택 가능
      localSubject.value = "전체";

      emit("update:searchQuery", searchText.value);
      emit("update:selectedYear", String(localYear.value));
      emit("update:selectedSubject", localSubject.value);
    };

    // ✅ 부모로부터 받은 props가 변경되면 동기화
    watch(() => props.searchQuery, (newVal) => {
      searchText.value = newVal;
    });

    watch(() => props.selectedYear, (newVal) => {
      localYear.value = newVal;
    });

    watch(() => props.selectedSubject, (newVal) => {
      localSubject.value = newVal;
    });

    return {
      userRole,
      userGrade,
      searchText,
      localYear,
      localSubject,
      emitSearch,
      emitFilter,
      emitReset,
    };
  },
});
</script>
