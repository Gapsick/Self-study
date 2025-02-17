const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL 연결 설정
const db = mysql.createConnection({
    host: "210.101.236.159",  // IPv4로 고정
    port: 3306,
    user: "ss",
    password: "1234",
    database: "ss_vue_test"
  });
  

// ✅ MySQL 연결 확인
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 오류:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

// ✅ 공지사항 목록 가져오기 API
app.get("/api/notices", (req, res) => {
  db.query("SELECT * FROM notices ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("❌ 공지사항 조회 오류:", err);
      res.status(500).json({ error: "데이터 조회 실패" });
      return;
    }
    res.json(results);  // ✅ MySQL에서 가져온 데이터 JSON 형식으로 반환
  });
});

// ✅ 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
