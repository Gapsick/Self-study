//idTokenController.js
function idTokenController(req, res) {
    const authHeader = req.headers['authorization'];
    jwt.verify(token, secretText, (err, user) => {
        if(err) return res.sendStatus(403);
        res.user = user;
    })
}

module.exports = {
    idTokenController
}