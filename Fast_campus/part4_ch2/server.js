const express = require('express');

const PORT = 4000;

const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    console.log(`start: ${req.method} ${req.url}`);
    next();
    const diffTime = Date.now() - start;
    console.log(`end: ${req.method} ${req.baseUrl} ${req.url} ${diffTime}ms`);
}) 

app.use('/users', usersRouter);
app.use('/posts', postsRouter);


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})