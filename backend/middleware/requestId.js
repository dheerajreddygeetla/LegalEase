const crypto = require('crypto');

/**
 * Attaches a short request id to every request/response so logs and
 * client-facing errors can be correlated. Honours an incoming
 * X-Request-Id when present (useful behind a reverse proxy).
 */
function requestId(req, res, next) {
    const incoming = req.get('x-request-id');
    const id =
        incoming && /^[\w-]{8,64}$/.test(incoming)
            ? incoming
            : crypto.randomBytes(8).toString('hex');

    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
}

module.exports = { requestId };
