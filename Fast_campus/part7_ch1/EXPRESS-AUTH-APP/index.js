const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();
const secretText = 'superSecret';
const refreshSecretText = 'supersuperSecret'

const posts = [
    {
        username: 'John',
        title: 'Post 1'
    },
    {
        username: 'Han',
        title: 'Post 2'
    }
]
let refreshTokens = [];


app.use(express.json());
app.use(cookieParser());

app.post('/login', (req,res) => {
    const username = req.body.username;
    const user = {
        name: username
    };

    // jwt를 이용해 토큰 생성 -> payload + secretText
    const accessToken = jwt.sign(user, secretText, { expiresIn: '30s' });

    // jwt를 이용해서 refreshToken도 생성
    const refreshToken = jwt.sign(user,
        refreshSecretText,
        { expiresIn: '1d' }) 
        refreshTokens.push(refreshToken);
    
    // refreshToken을 쿠키에 넣어주기
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({accessToken: accessToken});
})

app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts);
})

function authMiddleware(req, res, next) {
    // 토큰을 request header에서 가져오기
    const authHeader = req.headers['authorization'];
    // Bearer ~~~~~~~~~~~~~~.~~~~~~~~~~~.~~~~~~~~~~~
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    // 토큰이 있으니 유효한 토큰인지 확인
    jwt.verify(token, secretText, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

} 

app.get('/refresh', (req, res) => {

    // cookies 가져오기 cookie-parser
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(403);

    const refreshToken = cookies.jwt;
    // refreshtoken이 데이터베이스에 있는 토큰인지 확인
    if(!refreshToken.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    // token 이 유효한 토큰인지 확인
    jwt.verify(refreshToken, refreshSecretText, (err, user) => {
        if(err) return res.sendStatus(403);
        // accessToken을 생성하기
        const accessToken = jwt.sign({
            name: user.name
        }, secretText,
        { expiresIn: '30s'}
    )
        res.json({accessToken})
    })


})


const port = 4000;
app.listen(port, () => {
    console.log('listening on port' + port);
})

