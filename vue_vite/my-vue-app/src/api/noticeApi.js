import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Access Token 가져오는 함수 추가
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

// ✅ Refresh Token 가져오는 함수 추가
export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

// 🔹 공지사항 목록 조회
export const fetchNotices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notices`);
    console.log("📢 API 응답:", response.data);
    return response.data; 
  } catch (error) {
    console.error("🚨 공지사항 목록 조회 실패:", error);
    return [];
  }
};

// 🔹 공지사항 상세 조회
export function fetchNoticeDetail(noticeId) {
  return axios.get(`${API_BASE_URL}/${noticeId}`);
}

// 🔹 공지사항 작성 (JWT 포함)
export function createNotice(formData) {
  const token = getAccessToken();
  
  return axios.post(`${API_BASE_URL}/notices`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,  // ✅ JWT 추가
    },
    withCredentials: true, // ✅ 인증 포함
  });
}

// 🔹 Refresh Token을 이용해 새로운 Access Token 요청
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  const email = localStorage.getItem("userEmail"); 

  console.log("📢 (noticeApi.js) 가져온 userEmail:", email);
  console.log("🔄 (noticeApi.js) Refresh Token으로 Access Token 갱신 요청...");
  console.log("📢 (noticeApi.js) 보낼 Refresh Token:", refreshToken);
  console.log("📢 (noticeApi.js) 보낼 Email:", email);

  if (!refreshToken || !email) {
    console.error("❌ (noticeApi.js) Refresh Token 또는 Email 없음, 갱신 불가");
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, 
      { email },
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        withCredentials: true,
      }
    );

    console.log("✅ (noticeApi.js) 새로운 Access Token 발급 완료:", response.data.accessToken);

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("❌ (noticeApi.js) Access Token 갱신 실패:", error);
    return null;
  }
}

// ✅ 공지사항 작성 요청 (JWT 토큰 자동 갱신 포함)
export async function postNotice(noticeData) {
  let token = getAccessToken();
  console.log("📢 (noticeApi.js) 보낼 JWT 토큰:", token);
  console.log("📢 (noticeApi.js) 보낼 데이터:", JSON.stringify(noticeData));

  if (!token) {
    alert("로그인이 필요합니다.");
    return { error: "로그인이 필요합니다." };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/notices`, noticeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // ✅ JSON 데이터 형식 명확히 지정
      },
    });

    console.log("✅ (noticeApi.js) 공지사항 작성 성공:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.warn("🔄 (noticeApi.js) JWT Access Token 만료됨, 갱신 시도...");
      const newToken = await refreshAccessToken();
      if (!newToken) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }

      // ✅ 새로운 JWT로 다시 요청
      try {
        const retryResponse = await axios.post(`${API_BASE_URL}/notices`, noticeData, {
          headers: { Authorization: `Bearer ${newToken}`, "Content-Type": "application/json" },
        });
        return retryResponse.data;
      } catch (retryError) {
        console.error("❌ (noticeApi.js) 재요청 실패:", retryError);
      }
    }

    console.error("❌ (noticeApi.js) 공지사항 작성 오류:", error.response?.data || error);
    return { error: "공지사항 작성 실패" };
  }
}
