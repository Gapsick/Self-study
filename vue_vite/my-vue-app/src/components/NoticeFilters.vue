<template>
  <div class="filters">
    <!-- 학년 선택 -->
    <select v-model="localYear" @change="emitFilter">
      <option value="전체">전체 학년</option>
      <option v-if="userRole === 'student'" :value="userGrade">{{ userGrade }}학년</option>
      <option v-else value="1">1학년</option>
      <option v-else value="2">2학년</option>
      <option v-else value="3">3학년</option>
      <option v-if="canViewSpecial" value="특강">특강</option>
      <option v-if="canViewKorean" value="한국어">한국어</option>
    </select>

    <!-- 과목 선택 -->
    <select v-model="localSubject" @change="emitFilter">
      <option value="전체">
        {{ localYear !== '전체' ? `${localYear} 전체 공지` : '전체 대상' }}
      </option>
      <option
        v-for="subject in filteredSubjects"
        :key="subject.id"
        :value="subject.id"
      >
        {{ subject.name }}
      </option>
    </select>

    <!-- 검색 -->
    <input
      type="text"
      v-model="searchText"
      @keyup.enter="emitSearch"
      placeholder="검색어"
      class="search-input"
    />
    <button @click="emitSearch" class="rounded-btn">검색</button>
    <button @click="emitReset" class="rounded-btn gray">초기화</button>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    selectedYear: String,
    selectedSubject: String,
    searchQuery: String,
    subjects: Array,
  },
  setup(props, { emit }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role;
    const userGrade = String(user.grade || '');
    const userLevel = user.specialLecture || '';
    const userClass = user.class_group || '';
    const isForeign = user.is_foreign === 1;

    const canViewSpecial = userRole !== 'student' || (userLevel && userClass);
    const canViewKorean = userRole !== 'student' || isForeign;

    const localYear = ref(props.selectedYear);
    const localSubject = ref(props.selectedSubject);
    const searchText = ref(props.searchQuery);

    const filteredSubjects = computed(() => {
      const year = localYear.value;
      const subs = props.subjects;

      if (year === '전체') return [];

      if (['1', '2', '3'].includes(year)) {
        return subs.filter(
          (s) => String(s.academic_year) === year && s.category === '정규'
        );
      }

      if (year === '특강') {
        if (userRole === 'student') {
          if (!userLevel || !userClass) return [];
          return subs.filter(
            (s) =>
              s.category === '특강' &&
              s.level === userLevel &&
              (s.class_group === userClass || s.class_group === '전체')
          );
        } else {
          return subs.filter((s) => s.category === '특강');
        }
      }

      if (year === '한국어') {
        if (userRole === 'student' && !isForeign) return [];
        return subs.filter(
          (s) =>
            s.category === '한국어' &&
            (userRole !== 'student' || s.level === userLevel)
        );
      }

      return [];
    });

    const emitFilter = () => {
      emit('update:selectedYear', localYear.value);
      emit('update:selectedSubject', localSubject.value);
    };

    const emitSearch = () => {
      emit('update:searchQuery', searchText.value);
    };

    const emitReset = () => {
      localYear.value = '전체';
      localSubject.value = '전체';
      searchText.value = '';
      emit('update:selectedYear', '전체');
      emit('update:selectedSubject', '전체');
      emit('update:searchQuery', '');
    };

    return {
      userRole,
      userGrade,
      canViewSpecial,
      canViewKorean,
      localYear,
      localSubject,
      searchText,
      filteredSubjects,
      emitFilter,
      emitSearch,
      emitReset,
    };
  },
});
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  padding: 6px 12px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

select {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  min-width: 120px;
}

.rounded-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #1d4ed8;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.rounded-btn:hover {
  background-color: #1e40af;
}

.rounded-btn.gray {
  background-color: #f3f4f6;
  color: #374151;
}

.rounded-btn.gray:hover {
  background-color: #e5e7eb;
}
</style>
