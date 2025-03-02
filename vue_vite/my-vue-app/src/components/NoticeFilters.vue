<template>
    <div>
      <h3>공지사항 필터</h3>
  
      <!-- 🔎 검색 입력 -->
      <input
        type="text"
        v-model="searchText"
        placeholder="검색어 입력"
        @keyup.enter="emitSearch"
      />
      <button @click="emitSearch">검색</button>
      <button @click="emitReset">초기화</button>
  
      <!-- 🔹 학년 선택 -->
      <label>학년 선택:</label>
      <select v-model="localYear" @change="emitFilter">
        <option value="전체">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
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
      subjects: Object, // ✅ subjects를 props로 받음
    },
    setup(props, { emit }) {
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
        emit("update:selectedYear", localYear.value);
        emit("update:selectedSubject", localSubject.value);
      };
  
      // 🔹 초기화
      const emitReset = () => {
        searchText.value = "";
        localYear.value = "전체";
        localSubject.value = "전체";
  
        emit("update:searchQuery", searchText.value);
        emit("update:selectedYear", localYear.value);
        emit("update:selectedSubject", localSubject.value);
      };
  
      // ✅ 부모로부터 받은 `searchQuery`, `selectedYear`, `selectedSubject`가 변경되면 동기화
      watch(() => props.searchQuery, (newVal) => (searchText.value = newVal));
      watch(() => props.selectedYear, (newVal) => (localYear.value = newVal));
      watch(() => props.selectedSubject, (newVal) => (localSubject.value = newVal));
  
      return {
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
  