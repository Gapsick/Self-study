import { ref, computed } from "vue";

export function useNoticeFilters(notices) {
  const searchQuery = ref("");
  const selectedYear = ref("전체");
  const selectedSubject = ref("전체");

  const filterNotices = computed(() => {
    if (!notices.value) return [];

    let filtered = notices.value;

    if (selectedYear.value !== "전체") {
      filtered = filtered.filter((n) => n.academic_year == selectedYear.value);
    }

    if (selectedSubject.value !== "전체") {
      filtered = filtered.filter((n) => n.subject_id == selectedSubject.value);
    }

    if (searchQuery.value.trim() !== "") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  return { searchQuery, selectedYear, selectedSubject, filterNotices };
}
