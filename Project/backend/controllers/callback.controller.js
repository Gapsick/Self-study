// callback.controller.js
require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const axios = require('axios');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
app.use(express.json());


const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

async function callback(req, res, next) {

  const code = req.query.code

  // access_token 가져오기
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  // 사용자 정보 요청
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  // DB 연결
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  })

  // jwt 정보
  const user = {
    name: userInfo.data.name
  };

  // DB에 사용자 email이 있는지 확인 (userInfo.data.email값) + Prepare Statement 사용 (보안)
  connection.query('SELECT * FROM users WHERE email = ?', [userInfo.data.email], (err, results, fields) => {

    // 에러 날 경우
    if (err) return next(err);

    // 결과가 없을 경우
    if (results.length === 0) {
      connection.end();
      const data = {
        success: true,
        message: "회원가입필요",
        data: null,
        code: 200
      }

      return res.send(sendVue(data));

    } else {
      // 위의 커리 email값 저장
      const userId = results[0].id;

      // 결과가 있을 경우
      // jwt token 발행
      const jwtToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '20s' });

      // jwt를 이용해서 refreshToken 생성
      const refreshToken = jwt.sign(user,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '3d' })

      // refreshToken 저장
      query = "INSERT INTO oauth (id, google_id, refresh_token) values (?, ?, ?) ON DUPLICATE KEY UPDATE refresh_token = ?"
      connection.query(query, [userId, "Hello", refreshToken, refreshToken], (err, results, fields) => {
        // 에러
        if (err) return next(err);

        // 결과가 없을 경우
        if (results.length === 0) {
          const data = {
            success: false,
            message: "refreshToken 저장안됨",
            data: null,
            code: 400
          }
          return res.send(sendVue(data));
        } else {
          const data = {
            success: true,
            message: "승인됨",
            data: jwtToken,
            code: 201
          }

          // DB 연결 종료
          connection.end();

          // refreshToken을 쿠키에 넣기, key: jwt, value :refreshToken
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          });

          return res.send(sendVue(data));
        }
      })
    }
  })
}

// vue 반환 함수
function sendVue(data) {
  return `
          <html>
            <body>
              <script>
              const data = ${JSON.stringify(data)}

                // 메시지 전송
                window.opener.postMessage(data, 'http://localhost:5173');
                window.close();
              </script>
            </body>
          </html>
        `
}


module.exports = {
  callback
}