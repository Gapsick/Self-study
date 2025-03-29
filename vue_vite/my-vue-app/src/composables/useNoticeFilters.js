import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";

export function useNoticeFilters(notices) {
  const { userRole } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userGrade = parseInt(user.grade);
  const userSpecialLecture = user.specialLecture || "";

  const searchQuery = ref("");
  const selectedYear = ref("전체");
  const selectedSubject = ref("전체");

  const filterNotices = computed(() => {
    if (!notices.value) return [];

    let filtered = notices.value;

    if (userRole.value === "student") {
      if (selectedYear.value === "전체") {
        // 🔥 학생 + 전체 학년: '전체 대상' 공지들만 보여주고 특강 제외
        filtered = filtered.filter((n) => {
          const subject = n.subject || null;
          const isSpecial = subject?.category === "특강";
    
          const isCommon = !n.academic_year || n.academic_year === 0 || n.academic_year === "전체";
          return isCommon && !isSpecial;
        });
      } else {
        // 🔥 학생 + 특정 학년: 그 학년 정규 과목 + 자신의 특강만
        filtered = filtered.filter((n) => {
          const subject = n.subject || null;
          const isSpecial = subject?.category === "특강";
          const academicYear = parseInt(n.academic_year);
          const isMySpecial = isSpecial && subject.name.includes(userSpecialLecture);
          return academicYear === userGrade || isMySpecial;
        });
      }
    }
     else {
      // 교수/관리자
      if (selectedYear.value !== "전체") {
        const selected = parseInt(selectedYear.value);
        filtered = filtered.filter((n) => {
          const academicYear = parseInt(n.academic_year);
          return academicYear === selected;
        });
      } else {
        // 교수/관리자
        if (selectedYear.value !== "전체") {
          const selected = parseInt(selectedYear.value);
          filtered = filtered.filter((n) => {
            const academicYear = parseInt(n.academic_year);
            return academicYear === selected;
          });
        } else {
          // ✅ 관리자 + 전체 학년 → 공통 공지 & 특강 제외
          filtered = filtered.filter((n) => {
            const subject = n.subject || null;
            const isSpecial = subject?.category === "특강";
      
            const isCommon = !n.academic_year || n.academic_year === 0;
            return isCommon && !isSpecial;
          });
        }
      }
    }

    // 과목 필터
    if (String(selectedSubject.value) !== "전체") {
      if (String(selectedSubject.value).includes("전체")) {
        const yearFromFilter = selectedYear.value;
        filtered = filtered.filter((n) => {
          const year = String(n.academic_year);
          const subject = n.subject || null;
          const isGeneral = !n.subject_id || n.subject_id === "" || n.subject_id === null;
          const isCommon = subject?.name === "공통";
      
          return (
            year === yearFromFilter &&
            (isGeneral || isCommon)
          );
        });
      }
      else {
        // 일반 과목 ID
        filtered = filtered.filter((n) => n.subject_id == selectedSubject.value);
      }
    }
    // 만약 selectedSubject.value === "전체" 이면 필터 적용 안 함

    
    // 검색 필터
    if (searchQuery.value.trim() !== "") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    // 고정 공지 정렬
    filtered.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));

    return filtered;
  });

  return {
    searchQuery,
    selectedYear,
    selectedSubject,
    filterNotices,
  };
}
