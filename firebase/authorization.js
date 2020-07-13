//require('dotenv').config();
const serviceAccount = JSON.parse(process.env.FB_CREDENTIALS.replace(/\\r/g, '\\n'));

const connection = require('./connection.json');
const admin = require('firebase-admin');
const User = require("../db/queries/user");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: connection.databaseURL
});

function createSession(req, res) {
    const idToken = req.body.idToken;
    const expiresIn = 1000 * 60 * 60 * 24;

    admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true, secure: false };
        res.cookie('session', sessionCookie, options);

        admin.auth().verifySessionCookie(sessionCookie, true)
        .then((decodedClaims) => User.getUserById(decodedClaims.uid).then((user) => {
            if(user)
                res.status(200).end();
            else
                res.status(404).end();
        }));
    }, error => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
    });
}

function checkSession(session)
{
    return admin.auth().verifySessionCookie(session, true);
}

async function checkSocket(socket, next) {
    console.log(socket.handshake);
    claims = await checkSession(socket.handshake.query.cookie);
    if(claims) {
        socket.user = claims;
        next();
    }
    else
        next(new Error('Forbidden'));
}

function checkAuth(req, res, next) {
    const sessionCookie = req.cookies.session || '';

    admin.auth().verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => 
    {
        req.user = decodedClaims;
        next();
    })
    .catch(error => {
        res.status(403).send('FORBIDDEN!');
    });
}

function closeSession(req, res) {
    const sessionCookie = req.cookie.session || '';
    res.clearCookie('session');
    admin.auth().revokeRefreshTokens(req.uid);
}

module.exports = { checkAuth, createSession, closeSession, checkSocket };