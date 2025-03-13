import axios from 'axios';

// ✅ Google API 로드 함수 (Promise로 관리)
export function loadGoogleAPI() {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      console.log("✅ Google API 이미 로드됨");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("✅ Google API 로드 완료");
      resolve();
    };

    script.onerror = (error) => {
      console.error("❌ Google API 로드 실패:", error);
      reject(error);
    };

    document.head.appendChild(script);
  });
}

// ✅ Google OAuth 초기화 함수
export async function initGoogleAuth() {
  await loadGoogleAPI();

  return new Promise((resolve, reject) => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        scope: "openid email profile"
      }).then(() => {
        console.log("✅ Google OAuth 초기화 완료");
        resolve();
      }).catch(error => {
        console.error("❌ Google OAuth 초기화 실패:", error);
        reject(error);
      });
    });
  });
}

// ✅ Google 로그인 실행 함수
export async function googleLogin() {
  try {
    if (!window.gapi || !window.gapi.auth2) {
      console.error("❌ Google API가 아직 로드되지 않음");
      return null;
    }

    const googleAuth = await window.gapi.auth2.getAuthInstance().grantOfflineAccess({
      prompt: 'consent'
    });

    console.log('🔍 Google 로그인 응답:', googleAuth);

    const authCode = googleAuth.code;
    if (!authCode) {
      console.error("❌ Authorization Code 없음");
      return null;
    }

    // ✅ Authorization Code를 서버로 전송
    const response = await axios.post('http://localhost:3000/auth/google', { code: authCode });

    console.log("✅ 서버 응답:", response.data);
    return response.data; // JWT 반환
  } catch (error) {
    console.error("❌ Google 로그인 요청 실패:", error);
    
    // ✅ JSON 응답이 있는 경우 자세한 오류 출력
    if (error.response) {
      console.error("❌ 서버 응답 데이터:", JSON.stringify(error.response.data, null, 2));
      console.error("❌ 서버 응답 상태 코드:", error.response.status);
    } else {
      console.error("❌ 오류 메시지:", error.message);
    }

    return null;
  }
}