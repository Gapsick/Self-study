// auth.controller.js
const {google} = require('googleapis');

function authGet(req, res) {
    const CLIENT_ID = process.env.PORT;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
    );

    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope, you can pass it as a string
        scope: scopes
        });

    res.redirect(url);

}

module.exports = {
    authGet
}


