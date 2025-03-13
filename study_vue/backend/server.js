const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

// ✅ 공지사항 목록 가져오기
app.get("/api/notices", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// ✅ 새로운 공지 추가
app.post("/api/notices", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const newNotice = { id: data.length + 1, ...req.body };
  data.push(newNotice);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, notice: newNotice });
});

// ✅ 공지사항 삭제
app.delete("/api/notices/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const id = parseInt(req.params.id);
  data = data.filter(notice => notice.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 실행 중: http://localhost:${PORT}`);
});
