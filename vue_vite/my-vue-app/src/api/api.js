import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ 공지사항 목록 가져오기
export const fetchNotices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notices`);
    return response.data; // ✅ 서버에서 받은 데이터 반환
  } catch (error) {
    console.error("🚨 공지사항 목록 조회 실패:", error);
    return [];
  }
};
