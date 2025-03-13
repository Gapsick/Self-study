import axios from 'axios';

export const checkAuth = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) return { success: false };
  
    try {
      const response = await axios.get('http://localhost:3000/auth/check-auth', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data || { success: false, user: {} }; // ✅ 기본값 설정
    } catch (error) {
      console.error('JWT 확인 실패:', error);
      localStorage.removeItem('jwt'); // 토큰이 유효하지 않으면 삭제
      return { success: false, user: {} }; // ✅ `undefined` 방지
    }
  };
  