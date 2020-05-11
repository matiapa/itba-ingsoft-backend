const connection = require('./connection.json');
const serviceAccount = require('./credentials.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: connection.databaseURL
});

function createSession(req, res) {
    const idToken = req.body.idToken.toString();
    const expiresIn = 1000 * 60 * 60 * 24;

    admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true, secure: false };
        res.cookie('session', sessionCookie, options);
        res.status(204).end();
    }, error => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
    });
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

module.exports = { checkAuth, createSession, closeSession };