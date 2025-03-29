<template>
  <div class="filters-container">
    <div class="filters-right">

      <!-- 학년 선택 -->
      <select v-model="localYear" @change="emitFilter">
        <option value="전체">전체 학년</option>
        <template v-if="userRole === 'student'">
          <option :value="userGrade">{{ userGrade }}학년</option>
        </template>
        <template v-else>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </template>
      </select>

      <!-- 과목 선택 -->
      <select v-model="localSubject" @change="emitFilter">
        <option value="전체">
          {{ localYear !== '전체' ? `${localYear}학년 전체 공지` : '전체 대상' }}
        </option>

        <!-- 정규 과목 -->
        <optgroup label="정규 과목" v-if="localYear !== '전체'">
          <option
            v-for="subject in regularSubjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.name }}
          </option>
        </optgroup>

        <!-- 특강 -->
        <optgroup label="특강" v-if="localYear !== '전체'">
          <option
            v-for="subject in specialSubjects"
            :key="subject.id"
            :value="subject.id"
          >
            [특객] {{ subject.name }}
          </option>
        </optgroup>
      </select>

      <!-- 검색 -->
      <input type="text" v-model="searchText" @keyup.enter="emitSearch" placeholder="검색어" />
      <button @click="emitSearch" class="rounded-btn">검색</button>
      <button @click="emitReset" class="rounded-btn gray">초기화</button>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, computed, watch } from "vue";

export default defineComponent({
  props: {
    searchQuery: String,
    selectedYear: String,
    selectedSubject: String,
    subjects: Array,
  },
  setup(props, { emit }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user.role;
    const userGrade = parseInt(user.grade || "1");
    const userSpecialLecture = user.specialLecture || "";

    const searchText = ref(props.searchQuery);
    const localYear = ref(props.selectedYear);
    const localSubject = ref(props.selectedSubject);

    const regularSubjects = computed(() => {
    if (localYear.value === "전체") return [];

    console.log("🧪 전체 subjects 목록:", props.subjects);
    console.log("🧪 현재 선택된 학년:", localYear.value);

      return props.subjects.filter((s) =>
        s.category === "정규" && String(s.academic_year) === String(localYear.value)
      );
    });

    const specialSubjects = computed(() => {
      if (localYear.value === '전체') return [];
      if (userRole === "student") {
        return props.subjects.filter(
          (s) => s.category === "특강" && s.name.includes(userSpecialLecture)
        );
      } else {
        return props.subjects.filter((s) => s.category === "특강");
      }
    });

    const emitSearch = () => {
      emit("update:searchQuery", searchText.value);
    };
    const emitFilter = () => {
      emit("update:selectedYear", localYear.value);
      emit("update:selectedSubject", localSubject.value);
    };
    const emitReset = () => {
      searchText.value = "";
      localYear.value = "전체";
      localSubject.value = "전체";
      emit("update:searchQuery", "");
      emit("update:selectedYear", "전체");
      emit("update:selectedSubject", "전체");
    };

    watch(() => props.searchQuery, (v) => (searchText.value = v));
    watch(() => props.selectedYear, (v) => (localYear.value = v));
    watch(() => props.selectedSubject, (v) => (localSubject.value = v));
    watch(localYear, (newYear, oldYear) => {
      if (newYear !== oldYear) {
        localSubject.value = "전체";
        emit("update:selectedSubject", "전체");
      }
    });

    return {
      userRole,
      userGrade,
      searchText,
      localYear,
      localSubject,
      regularSubjects,
      specialSubjects,
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

input[type="text"],
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
