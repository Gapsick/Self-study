require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // ✅ 쿠키 포함 허용
}));

// 첫 로그인 -> JWT 확인
function checkJWT(req, res) {
    // JWT 있는지 확인
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        // token이 유효한지 확인
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

            // 완료된 Token
            if (err && err.name === 'TokenExpiredError') return res.send("Token 완료됨");

            // 그냥 error
            if (err) return res.send("Token Error");

            // 검증 완료 된 경우, 파싱한 값 반환
            req.user = user;
            return res.send("Go Main");
        })

    } else {  // 없으면 error 날림
        res.send("JWT 없음");
    }
}

// Refresh Token으로 Access Token 재발급
function checkRefreshToken(req, res) {
    // 쿠키 갇고 오기
    const cookies = req.cookies;

    // refreshToken 갇고오기 -> key: jwt
    const refreshToken = cookies.jwt;

    // Test용 log
    console.log(refreshToken);

    // Access Token이 없을경우
    if (!refreshToken) return res.send("Access Token 없음");

    // DB에 있는 refreshToken이랑 맞는지 확인
    // const refreshToken = cookies.jwt;
    // DB 연결
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })

    // query 보내기
    const query = 'SELECT * FROM users u JOIN oauth o ON u.id = o.id WHERE o.refresh_token = ?';
    connection.query(query, [refreshToken], (err, results, field) => {

        // 에러가 날 경우
        if (err) throw next(err);

        // 결과 값이 없을 경우
        if (results.length === 0) {
            connection.end();
            return res.send("Refresh_Token 없음");
        } else {
            // DB 종료
            connection.end();
            // Refresh Token이랑 맞는 유저정보가 있을 경우
            // jwt token 만들기
            const jwtToken = jwt.sign(results[0], process.env.JWT_SECRET, { expiresIn: '2h' });

            // 반환
            res.send(jwtToken);
        }
    })
}

module.exports = {
    checkJWT,
    checkRefreshToken
}