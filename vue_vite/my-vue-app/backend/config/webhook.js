// webhook.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    const userId = event.source.userId;
    const message = event.message?.text;

    console.log('📥 받은 userId:', userId);
    console.log('📨 받은 메시지:', message);
    // TODO: userId 저장(DB, 파일 등)
  }

  res.sendStatus(200);
});

module.exports = router;
