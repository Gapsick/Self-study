const path = require('path');

function getPost(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'images', 'logo.png'));
}

module.exports = {
    getPost
}