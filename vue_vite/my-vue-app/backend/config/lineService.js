const axios = require('axios');

const CHANNEL_ACCESS_TOKEN = 'lIV2BPL8n7nB/3LJw3AAISIffj72ZUPdb/F1rVDvIbfavVHw1ngOx6uXGzCPt6PqhsD8NYKKpMXrPKJUfSzkrLVp8w04Y/oyy/LZ34dv0XMn8Rz9Xnjzs0dMalk4pETv7e21wIRfv3CTo55JukuiGQdB04t89/1O/w1cDnyilFU=';
// const TEST_USER_ID = 'U2db080965623b1fa609cd86a6d18cc37'; // 수신자 LINE userId (네 user ID로 테스트 가능)

async function sendLineMessage(userId, message) {
  try {
    const res = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
    console.log('✅ 메시지 전송 성공:', res.status);
  } catch (err) {
    console.error('❌ 메시지 전송 실패:', err.response?.data || err.message);
  }
}

module.exports = { sendLineMessage };