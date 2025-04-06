const { sendLineMessage } = require('../config/lineService');
const { generateNoticeMessage } = require('./lineTemplates/noticeTemplate');

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

module.exports = {
  sendNoticeAlert,
};
