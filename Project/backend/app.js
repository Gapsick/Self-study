// app.js
require('dotenv').config()
const express = require('express');
const app = express()
const port = 3000
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());



// 라우터
// 구글 oauth
const authRouter = require('./routes/auth.router');
app.use('/auth', authRouter);

// Register
const registerRouter = require('./routes/register.router')
app.use('/register', registerRouter)


// ID Token값 분석
const idToken = require('./routes/idtoken.router');
app.use('/idtoken', idToken)




// Error Handling 연결
const errorHandler =  require ('./middlewares/errorHandler.js')
app.use(errorHandler);

// DB 정보
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

// DB 연결
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});


// 포트 열기
app.listen(port, () => {
    console.log('server on');
})