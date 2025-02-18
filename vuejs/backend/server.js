const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // 🚀 `fetch` 추가

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true
}));

const JWT_SECRET = 'my_secret_key';

// Google 로그인 API
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Google API를 사용하여 토큰 검증
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    const data = await response.json();

    console.log('Google API 응답:', data); // 디버깅용 로그 추가

    if (data.error) {
      return res.status(401).json({ message: '유효하지 않은 토큰', error: data });
    }

    // 사용자 정보 저장
    const user = {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture
    };

    // 자체 JWT 토큰 발급
    const customToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token: customToken, user });

  } catch (error) {
    console.error('Google 로그인 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
});

// 서버 실행
app.listen(3000, () => console.log('서버 실행 중: http://localhost:3000'));
