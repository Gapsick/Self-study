import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth"; // ✅ 유저 정보 가져오기

export function useNoticeFilters(notices) {
  const { userRole, userGrade } = useAuth(); // ✅ 학년 정보 가져오기
  const searchQuery = ref("");
  const selectedYear = ref("전체");
  const selectedSubject = ref("전체");

  const filterNotices = computed(() => {
    if (!notices.value) return [];

    let filtered = notices.value;

    console.log("📢 현재 userRole:", userRole.value);
    console.log("📢 현재 userGrade:", userGrade.value);
    console.log("📢 현재 notices 데이터:", notices.value);

    // ✅ 학생인 경우, 자기 학년 + 공통 공지만 보이도록 수정
    if (userRole.value === "student") {
      // ✅ 학생인 경우, 전체를 선택하면 자기 학년 + 공통 공지 보이기
      if (selectedYear.value === "전체") {
        filtered = filtered.filter(
          (n) =>
            n.academic_year == userGrade.value || 
            n.academic_year === null // 공통 공지 포함
        );
      } else {
        // ✅ 특정 학년을 선택한 경우, 해당 학년 공지만 표시
        filtered = filtered.filter((n) => n.academic_year == selectedYear.value);
      }
    } else {
      // ✅ 관리자의 경우, 전체를 선택하면 모든 공지 표시
      if (selectedYear.value === "전체") {
        filtered = notices.value; // 전체 공지 그대로 유지
      } else {
        // ✅ 특정 학년을 선택하면 해당 학년의 공지만 표시
        filtered = filtered.filter((n) => n.academic_year == selectedYear.value);
      }
    }
    
    

    // ✅ 과목 필터링
    if (selectedSubject.value !== "전체") {
      filtered = filtered.filter((n) => n.subject_id == selectedSubject.value);
    }

    // ✅ 검색 기능
    if (searchQuery.value.trim() !== "") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    // ✅ 고정된 공지를 맨 위로 정렬
    filtered.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));

    console.log("📢 최종 필터링된 notices:", filtered); // ✅ 디버깅용

    return filtered;
  });

  return { searchQuery, selectedYear, selectedSubject, filterNotices };
}
