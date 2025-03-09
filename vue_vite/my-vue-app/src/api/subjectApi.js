import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ 전체 과목 가져오기
export const fetchSubjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects`);
    return response.data;
  } catch (error) {
    console.error("🚨 과목 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 학년별 과목 가져오기
export const fetchSubjectsByYear = async (academicYear) => {
  try {
    if (academicYear === "전체") {
      return await fetchSubjects(); // 전체 과목 반환
    }
    const response = await axios.get(`${API_BASE_URL}/subjects`, {
      params: { academic_year: academicYear } // ✅ 쿼리 파라미터로 요청!
    });
    return response.data;
  } catch (error) {
    console.error(`🚨 ${academicYear}학년 과목 목록 조회 실패:`, error);
    return [];
  }
};

