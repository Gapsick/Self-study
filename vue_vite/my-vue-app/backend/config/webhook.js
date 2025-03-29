const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendLineMessage } = require('./lineService');

router.post('/', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    const userId = event.source.userId;
    console.log('🧾 이벤트 타입:', event.type);  // ← 이거 꼭 찍어보자!
    console.log('📥 받은 userId:', event.source.userId);
    console.log('📨 받은 메시지:', event.message?.text);
  
    // ✅ 친구 추가 시 자동 안내
    if (event.type === 'follow') {
      await sendLineMessage(
        userId,
        `👋 안녕하세요! 알리미에 오신 걸 환영합니다.\n\n📌 아래와 같은 형식으로 학번을 입력해 주세요:\n\n학번:20230001`
      );
      continue;
    }

    const message = event.message?.text;

    // ✅ 일반 텍스트 메시지가 아닐 경우 무시
    if (!message) {
      continue;
    }

    // ✅ "학번:"으로 시작하지 않으면 안내 메시지 전송
    if (!message.startsWith('학번:')) {
      await sendLineMessage(
        userId,
        `📌 LINE 연동을 위해 아래와 같이 입력해주세요:\n\n학번:20230001`
      );
      continue;
    }

    // ✅ 학번 추출
    const studentId = message.replace('학번:', '').trim();

    try {
      // 1. 학번으로 사용자 조회
      const [rows] = await db.promise().query(
        'SELECT * FROM users WHERE student_id = ?',
        [studentId]
      );

      if (rows.length === 0) {
        await sendLineMessage(userId, '❌ 등록된 학번이 없습니다. 다시 확인해주세요.');
        console.log('❌ 존재하지 않는 학번:', studentId);
        continue;
      }

      const user = rows[0];

      // 2. userId 저장
      await db.promise().query(
        'UPDATE users SET line_user_id = ? WHERE student_id = ?',
        [userId, studentId]
      );

      // 3. 성공 메시지
      await sendLineMessage(userId, `✅ ${user.name}님, LINE 연동이 완료되었습니다!`);
      console.log(`✅ ${user.name} (${studentId}) 연동 완료!`);
    } catch (err) {
      console.error('❌ DB 연동 중 에러:', err);
      await sendLineMessage(userId, '⚠️ 시스템 오류가 발생했습니다. 관리자에게 문의해주세요.');
    }
  }

  res.sendStatus(200);
});

module.exports = router;
