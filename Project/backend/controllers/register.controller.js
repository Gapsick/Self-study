// register.controller.js
const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql');
require('dotenv').config();

function registerPost(req, res, next) {

    // 값 확인
    const { email, name, phone_number } = req.body;

    // 1. 비어 있으면 error
    if (email == "" || name == "" || phone_number == "") {
        return res.status(400).json({
            success: false,
            message: "값이 비어 있음",
            data: null,
            code: 400
        });
    }

    // DB 연결
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })

    // DB 입력
    connection.query('INSERT INTO users (email, name, phone_number) values (?, ?, ?)',
        [email, name, phone_number], (err, results, fields) => {

            // 에러 날 경우
            if (err) return next(err);

            // 저장 잘 됬을 경우
            if (results.affectedRows == 1) {
                res.status(201).json({
                    success: true,
                    message: "회원가입 성공",
                    data: null,
                    code: 201
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "DB저장 실패",
                    data: null,
                    code: 400
                });
            }
            // DB 연결 종료
            connection.end();
        });
}

module.exports = {
    registerPost
}