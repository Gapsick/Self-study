// callback.controller.js
const express = require('express');
const app = express();
const mysql = require('mysql');
const axios = require('axios');
const { google } = require('googleapis');
app.use(express.json());


const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID, 
        CLIENT_SECRET, 
        REDIRECT_URI
    );

async function callback(req, res) {

    const code = req.query.code

    // access_token 가져오기
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    // 사용자 정보 요청
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    console.log(userInfo.data);

    const connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    })

    // DB에 사용자 email이 있는지 확인 (userInfo.data.email값) + Prepare Statement 사용 (보안)
    connection.query('SELECT * FROM users WHERE email = ?', [userInfo.data.email], (err, results, fields) => {
      
      // 에러 날 경우
      if(err) throw err;


      // 결과가 없을 경우
      if (results.length === 0) {
        res.send("Go Register");
      } else {
        // 결과가 있을 경우
        // jwt token 발행
        const jwtToken = jwt.sign(user, secretText, { expiresIn: '2h'});

        // jwt를 이용해서 refreshToken 생성
        const refreshToken = jwt.sign(user,
          refreshSecretText,
          { expiresIn: '3d'})
          refreshTokens.push(refreshToken);
        
        // refreshToken을 쿠키에 넣기
        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
          jwtToken: accessToken,
          res : "Go Main"
        });
      }

      // DB 연결 종료
      connection.end();

    })
}

module.exports = {
    callback
}