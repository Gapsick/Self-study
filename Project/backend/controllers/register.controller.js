// register.controller.js
const express = require('express');
const app = express();
app.use(express.json());

function registerPost(req, res) {
    
    // 값 확인
    const {email, name, age} = req.body;

    // 1. 비어 있으면 error
    if (email == "" || name == "" || age == "") {
        res.send("error");
        return;
    }

    // DB 연결
    const connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    })    

    // DB 입력
    connection.query('INSERT INTO users (email, name, age) values (?, ?, ?)',
        [email, name, age], (err, results, fields) => {
            
            // 에러 날 경우
            if (err) throw err;

            // 저장 잘 됬을 경우
            if (results.affectedRows == 1) {
                res.send("register success");
            } else {
                res.send("error");
            }

            // DB 연결 종료
            connection.end();

    });
}

module.exports = {
    registerPost
}