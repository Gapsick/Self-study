import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * 🔹 공지사항 목록 조회
 */
export const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notices`);
      console.log("📢 API 응답:", response.data);  // 응답 데이터 확인
      return response.data; // ✅ 배열 반환
    } catch (error) {
      console.error("🚨 공지사항 목록 조회 실패:", error);
      return [];
    }
  };

/**
 * 🔹 공지사항 상세 조회
 */
export function fetchNoticeDetail(noticeId) {
  return axios.get(`${API_BASE_URL}/${noticeId}`);
}

/**
 * 🔹 공지사항 작성
 */
export function createNotice(formData) {
  return axios.post(API_BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
