export function checkAuth() {
    const token = localStorage.getItem("accessToken");
  
    console.log("🔍 checkAuth() 실행됨, 저장된 Access Token:", token);
  
    if (!token) {
      console.log("❌ Access Token 없음, 로그인 필요");
      return null;
    }
  
    console.log("✅ 로그인 유지됨, LocalStorage에서 가져옴.");
    return { token };
  }
  
  
    try {
      // ✅ 서버에 현재 사용자 정보 요청
      const response = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      console.log("✅ 로그인 유지됨, 사용자 정보:", response.data);
      return response.data;
    } catch (error) {
      console.log("🔄 Access Token 만료, Refresh Token 시도");
      
      try {
        // ✅ Refresh Token을 사용해서 새로운 Access Token 요청
        const refreshResponse = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true });
  
        const newAccessToken = refreshResponse.data.accessToken;
        console.log("✅ 새로운 Access Token 발급:", newAccessToken);
  
        localStorage.setItem("accessToken", newAccessToken);
  
        // ✅ 새 Access Token으로 다시 사용자 정보 가져오기
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        });
  
        console.log("✅ 로그인 유지 성공, 사용자 정보:", response.data);
        return response.data;
      } catch (refreshError) {
        console.error("❌ Refresh Token도 만료됨, 로그인 필요");
        localStorage.removeItem("accessToken");
        return null;
      }
    }
  
  