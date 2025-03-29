import { ref, watchEffect } from "vue";
import { fetchSubjects } from "@/api/subjectApi"; // fetchSubjects만 사용!

export function useSubjects(selectedYear) {
  const subjects = ref([]);

  const loadSubjects = async () => {
    try {
      console.log(`📢 useSubjects - ${selectedYear.value} 과목 로딩 중...`);

      // 🔹 무조건 전체 과목 가져오기 (정규 + 특강 포함)
      const data = await fetchSubjects();

      subjects.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("🚨 과목 불러오기 실패:", error);
      subjects.value = [];
    }
  };

  // 학년이 바뀔 때마다 과목 새로 불러오기
  watchEffect(() => {
    loadSubjects();
  });

  return { subjects, loadSubjects };
}
