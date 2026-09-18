// services/googleAuthService.js
// Verifies a Google Sign-In ID token server-side. The previous
// implementation trusted whatever { name, email } the client sent, which
// let anyone log in as any existing account with no proof of identity.
const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

let client = null;
function getClient() {
    if (!env.GOOGLE_CLIENT_ID) {
        throw ApiError.serviceUnavailable('Google Sign-In is not configured on the server.');
    }
    if (!client) {
        client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    }
    return client;
}

/**
 * Verifies a Google-issued ID token (the credential returned by Google
 * Identity Services on the frontend) and returns the trusted profile
 * payload. Throws ApiError(401) if the token is missing, expired, or was
 * not issued for this application's client ID.
 */
async function verifyGoogleIdToken(idToken) {
    if (!idToken || typeof idToken !== 'string') {
        throw ApiError.badRequest('Google idToken is required');
    }

    const oAuthClient = getClient();

    let ticket;
    try {
        ticket = await oAuthClient.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });
    } catch (err) {
        throw ApiError.unauthorized('Google authentication failed: invalid or expired token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw ApiError.unauthorized('Google authentication failed: no email in token');
    }
    if (!payload.email_verified) {
        throw ApiError.unauthorized('Google account email is not verified');
    }

    return {
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split('@')[0],
    };
}

module.exports = { verifyGoogleIdToken };
