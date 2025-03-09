import { ref, watchEffect } from "vue";
import { fetchSubjects, fetchSubjectsByYear } from "@/api/subjectApi";

export function useSubjects(selectedYear) {
  const subjects = ref([]);

  const loadSubjects = async () => {
    try {
      console.log(`📢 useSubjects - ${selectedYear.value} 과목 로딩 중...`);

      let data;
      if (selectedYear.value === "전체") {
        data = await fetchSubjects(); // ✅ 전체 과목 로드
      } else {
        data = await fetchSubjectsByYear(selectedYear.value); // ✅ 특정 학년 과목 로드
      }

      console.log("📢 API 응답 데이터:", data);

      subjects.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`🚨 ${selectedYear.value} 과목 불러오기 실패:`, error);
      subjects.value = [];
    }
  };

  watchEffect(() => {
    loadSubjects();
  });

  return { subjects, loadSubjects };
}
