const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { generateToken } = require('../config/jwt');
const { getUserById, createUser } = require('../models/userModel');

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    const data = await response.json();

    if (!data.email.endsWith("@g.yju.ac.kr")) {
      return res.status(403).json({ message: '허용되지 않은 도메인입니다. 학과 계정(@g.yju.ac.kr)으로 로그인하세요.' });
    }

    const studentId = data.email.split("@")[0];
    const currentYear = new Date().getFullYear();
    const admissionYear = parseInt(studentId.substring(0, 4));
    const year = currentYear - admissionYear + 1;

    let user = await getUserById(data.sub);
    if (!user) {
      await createUser({ id: data.sub, email: data.email, name: data.name, studentId, year, picture: data.picture });
      return res.json({ success: false, message: "승인 대기 중입니다. 관리자의 승인을 기다려주세요." });
    }

    if (!user.approved) {
      return res.json({ success: false, message: "승인 대기 중입니다. 관리자의 승인을 기다려주세요." });
    }

    const customToken = generateToken(user);
    res.json({ success: true, token: customToken, user });

  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

module.exports = { googleAuth };
