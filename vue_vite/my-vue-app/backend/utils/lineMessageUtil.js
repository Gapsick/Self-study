const { sendLineMessage } = require('../config/lineService');
const { generateNoticeMessage } = require('./lineTemplates/noticeTemplate');
const { generateLectureMessage } = require('./lineTemplates/timetableTemplate');  // ✅ 시간표 템플릿 불러오기

// 🔤 요일 변환 (영어 → 한글)
const convertDayToKorean = (day) => {
  const map = {
    Monday: '월요일',
    Tuesday: '화요일',
    Wednesday: '수요일',
    Thursday: '목요일',
    Friday: '금요일',
    Saturday: '토요일',
    Sunday: '일요일'
  };
  return map[day] || day;
};

// 공지사항
async function sendNoticeAlert(userIds, {
  type = 'create',
  title,
  content,
  author,
  academic_year,
  category,
  level,
  class_group,
  link,
  file_path
}) {
  const textMessage = {
    type: 'text',
    text: generateNoticeMessage({
      type,
      title,
      content,
      author,
      academic_year,
      category,
      level,
      class_group,
      link,
      file_path
    }),
  };

  for (const userId of userIds) {
    await sendLineMessage(userId, textMessage);
  }
}

// 🔔 특강 등록 또는 휴강 시 전송할 알림
async function sendTimetableAlert(userIds, {
  type = 'special',      // 'special' | 'cancel'
  subject,
  professor,
  day,
  period,
  level,
  class_group,
  link
}) {
  const textMessage = {
    type: 'text',
    text: generateLectureMessage({
      type,
      subject,
      professor,
      day: koreanDay,
      period,
      level,
      class_group,
      link
    }),
  };

  for (const userId of userIds) {
    await sendLineMessage(userId, textMessage);
  }
}


module.exports = {
  sendNoticeAlert,
  sendTimetableAlert,
};
