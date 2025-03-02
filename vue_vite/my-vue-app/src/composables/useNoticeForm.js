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

    // ✅ 학년 값 변환
    let processedAcademicYear = noticeData.value.academic_year;
    if (processedAcademicYear === "전체") {
      processedAcademicYear = null; // ✅ "전체"는 null 처리
    } else if (!isNaN(Number(processedAcademicYear))) {
      processedAcademicYear = parseInt(processedAcademicYear, 10); // ✅ 확실한 숫자로 변환
    } else {
      console.warn("❌ 유효하지 않은 학년 값:", processedAcademicYear);
      processedAcademicYear = null; // ✅ 예외 처리
    }

    // ✅ 최종 데이터 구성
    const processedData = {
      ...noticeData.value,
      academic_year: processedAcademicYear, // ✅ 변환된 학년 값 적용
    };

    console.log("🚀 공지사항 저장 요청 데이터:", processedData);
    return await makeAuthorizedRequest(url, isEdit ? "put" : "post", processedData);
  }

  return { noticeData, handleFileUpload, submitNotice };
}
