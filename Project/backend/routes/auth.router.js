const express = require('express');

const authRouter = express.Router();
const authcheckJWT = require('../controllers/auth.checkJWT');
const authController = require('../controllers/auth.controller');
const authCallback = require('../controllers/callback.controller');


// login창 들어왔을때 token값 확인
authRouter.get('/', authcheckJWT.checkJWT);
// JWT가 만료 되었을때 경우
authRouter.get('/refresh', authcheckJWT.checkRefreshToken)
// google 로그인 창 반환
authRouter.get('/login', authController.authGet);
// google에서 로그인 했을때 인가코드 로직
authRouter.get('/google/callback', authCallback.callback);

module.exports = authRouter;