<template>
  <div class="filters-container">
    <div class="filters-right">
      <!-- 🔹 학년 선택 -->
      <select v-model="localYear" @change="emitFilter">
        <option value="전체">전체 학년</option>
        <option v-if="userRole === 'student'" :value="userGrade">
          {{ userGrade }}학년
        </option>
        <option v-if="userRole !== 'student'" value="1">1학년</option>
        <option v-if="userRole !== 'student'" value="2">2학년</option>
        <option v-if="userRole !== 'student'" value="3">3학년</option>
      </select>

      <!-- 🔹 과목 선택 -->
      <select v-model="localSubject" @change="emitFilter">
        <option value="전체">전체 과목</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
        </option>
      </select>

      <!-- 🔎 검색 영역 -->
      <input
        type="text"
        v-model="searchText"
        placeholder="검색어 입력"
        @keyup.enter="emitSearch"
      />
      <button class="rounded-btn" @click="emitSearch">검색</button>
      <button class="rounded-btn gray" @click="emitReset">초기화</button>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from "vue";

export default defineComponent({
  props: {
    searchQuery: String,
    selectedYear: String,
    selectedSubject: String,
    subjects: Array,
  },
  setup(props, { emit }) {
    const userRole = localStorage.getItem("role");
    const userGrade = parseInt(localStorage.getItem("grade") || "1");

    const searchText = ref(props.searchQuery);
    const localYear = ref(props.selectedYear);
    const localSubject = ref(props.selectedSubject);

    const emitSearch = () => {
      emit("update:searchQuery", searchText.value);
    };

    const emitFilter = () => {
      emit("update:selectedYear", String(localYear.value));
      emit("update:selectedSubject", localSubject.value);
    };

    const emitReset = () => {
      searchText.value = "";
      localYear.value = "전체";
      localSubject.value = "전체";
      emit("update:searchQuery", searchText.value);
      emit("update:selectedYear", String(localYear.value));
      emit("update:selectedSubject", localSubject.value);
    };

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

<style scoped>
.filters-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  margin-top: -30px;
  padding-right: 8px;
}

.filters-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="text"] {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.rounded-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 20px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.rounded-btn:hover {
  background-color: #2563eb;
}

.rounded-btn.gray {
  background-color: #e5e7eb;
  color: #333;
}

.rounded-btn.gray:hover {
  background-color: #d1d5db;
}
</style>
