// testSend.js
const { sendLineMessage } = require('./lineService'); // 경로 맞게 수정

const testUserId = 'U5cadbbd8ec6f736d79d19caa0c6bc4c1'; // 🔥 방금 받은 userId
const testMessage = '성관 빨리와 ^^';

sendLineMessage(testUserId, testMessage);
