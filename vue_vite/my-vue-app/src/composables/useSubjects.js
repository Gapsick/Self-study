import { ref, reactive, watchEffect } from "vue";
import { fetchSubjects, fetchSubjectsByYear } from "@/api/subjectApi";

export function useSubjects(selectedYear) {
  const subjects = reactive({ value: [] }); // ✅ ref() 대신 reactive() 사용

  const loadSubjects = async () => {
    console.log("📢 useSubjects - 과목 데이터 로딩 시작");

    try {
      let data;
      if (selectedYear.value === "전체") {
        data = await fetchSubjects();
      } else {
        data = await fetchSubjectsByYear(selectedYear.value);
      }

      console.log("📢 useSubjects - 응답 데이터:", data);

      if (data && Array.isArray(data)) {
        subjects.value = data;
      } else {
        console.error("🚨 useSubjects - API에서 배열이 아닌 값 반환됨:", data);
        subjects.value = [];
      }
    } catch (error) {
      console.error("🚨 useSubjects - 과목 목록 불러오기 실패:", error);
      subjects.value = [];
    }
  };

  watchEffect(() => {
    console.log("📢 useSubjects - selectedYear 변경 감지:", selectedYear.value);
    if (selectedYear.value !== "") { // ✅ 빈 값이 아닐 때만 실행
      loadSubjects();
    }
  });
  

  return { subjects, loadSubjects };
}
