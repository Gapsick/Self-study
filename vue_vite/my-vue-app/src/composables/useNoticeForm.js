import { ref } from "vue";
import axios from "axios";
import { getAccessToken, refreshAccessToken } from "@/api/noticeApi";
import { useRouter } from "vue-router";

const API_BASE_URL = "http://localhost:5000/api"; // ✅ API URL

export function useNoticeForm(initialData = {}) {
  const router = useRouter();

  // ✅ 공지사항 데이터 초기화
  const noticeData = ref({
    title: initialData.title || "",
    content: initialData.content || "",
    academic_year: initialData.academic_year || null,
    subject_id: initialData.subject_id || null,
    is_pinned: initialData.is_pinned || false,
    file: null,
  });

  // 🔹 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    noticeData.value.file = file;
  };

  // 🔹 JWT 토큰을 포함한 요청 함수
  async function makeAuthorizedRequest(url, method, data) {
    let token = getAccessToken();

    if (!token) {
      console.warn("❌ JWT 토큰이 없음, 새로 갱신 시도");
      token = await refreshAccessToken();
      if (!token) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return { error: "로그인이 필요합니다." };
      }
    }

    let headers = {
      Authorization: `Bearer ${token}`,
    };

    let requestData;
    if (data instanceof FormData) {
      requestData = data;
      headers["Content-Type"] = "multipart/form-data";
    } else {
      // ✅ null 값 필터링하여 전송
      requestData = Object.fromEntries(
        Object.entries({ ...data }).filter(([_, v]) => v !== null && v !== undefined && v !== "") 
      );
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await axios({
        method,
        url,
        data: requestData,
        headers,
        withCredentials: true,
      });

      console.log(`✅ (useNoticeForm.js) ${method.toUpperCase()} 요청 성공:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ (useNoticeForm.js) ${method.toUpperCase()} 요청 실패:`, error.response?.data || error);

      // 🔹 만약 403 오류라면, 토큰 갱신 후 재시도
      if (error.response?.status === 403) {
        console.warn("🔄 JWT 토큰 갱신 시도 중...");
        token = await refreshAccessToken();
        if (token) {
          return makeAuthorizedRequest(url, method, data); // ✅ 토큰 갱신 후 재시도
        }
      }

      alert("요청 처리 중 오류가 발생했습니다.");
      return { error: "요청 실패" };
    }
  }

// 🔹 공지사항 저장 (작성 & 수정 통합)
async function submitNotice(isEdit = false, noticeId = null) {
  const url = isEdit
    ? `${API_BASE_URL}/notices/${noticeId}`
    : `${API_BASE_URL}/notices`;

  const formData = new FormData();
  formData.append("title", noticeData.value.title);
  formData.append("content", noticeData.value.content);
  
  // ✅ academic_year 값 변환 (전체일 경우 null)
  const academicYear = noticeData.value.academic_year === "전체" ? null : noticeData.value.academic_year;
  formData.append("academic_year", academicYear);

  formData.append("subject_id", noticeData.value.subject_id || null);
  formData.append("is_pinned", noticeData.value.is_pinned ? "1" : "0");

  if (noticeData.value.file) {
    formData.append("file", noticeData.value.file);
  }

  const userName = localStorage.getItem("userName") || "관리자";
  formData.append("author", userName);

  console.log("🚀 전송할 FormData:", [...formData.entries()]);

  try {
    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return true;
  } catch (error) {
    console.error("❌ 공지사항 업로드 실패:", error);
    return false;
  }
}

  return { noticeData, handleFileUpload, submitNotice };
}
