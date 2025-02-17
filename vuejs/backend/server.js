const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');  // CORS 모듈 추가

const app = express();

// CORS 설정: 프론트엔드 포트인 8080을 허용
app.use(cors({
  origin: 'http://localhost:8080',  // Vue.js 앱이 실행되는 포트
  methods: ['GET', 'POST'],  // 사용할 HTTP 메소드
  credentials: true  // 쿠키를 전달할 경우 필요
}));

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth 설정
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Google 로그인 라우트
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google 로그인 후 콜백
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, name: req.user.displayName, email: req.user.emails[0].value }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:8080?token=${token}`);
  }
);

// 포트 설정
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
