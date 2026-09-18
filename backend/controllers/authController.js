const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyGoogleIdToken } = require('../services/googleAuthService');

const generateToken = (id, rememberMe = false) => {
    const expiresIn = rememberMe ? '30d' : '1d';
    return jwt.sign({ id }, env.JWT_SECRET, { expiresIn });
};

const publicUser = (user, rememberMe = false) => ({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id, rememberMe),
});

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
        throw ApiError.conflict('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });

    res.status(201).json({ success: true, ...publicUser(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    // Deliberately identical error message/timing profile for "no such
    // user" and "wrong password" so the endpoint can't be used to enumerate
    // registered email addresses.
    if (!user) {
        throw ApiError.badRequest('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw ApiError.badRequest('Invalid email or password');
    }

    res.json({ success: true, ...publicUser(user, rememberMe) });
});

// POST /api/auth/google
// Verifies a real Google-issued ID token server-side (see
// services/googleAuthService.js) instead of trusting a client-supplied
// email/name pair, which previously allowed logging in as any account.
exports.googleAuth = asyncHandler(async (req, res) => {
    const { idToken, rememberMe = false } = req.body;
    const { email, name } = await verifyGoogleIdToken(idToken);

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
        // Generate a random password so the account still satisfies the
        // schema; it is never exposed and is not usable via /login since
        // the user has no way to learn it (they'll always use Google Sign-In).
        const randomPassword = require('crypto').randomBytes(24).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            authProvider: 'google',
        });
    } else if (user.authProvider !== 'google') {
        // Same verified Google email as an existing local account — allow
        // sign-in without changing their password-based provider flag.
        if (!user.name && name) {
            user.name = name;
            await user.save();
        }
    }

    res.json({ success: true, ...publicUser(user, rememberMe) });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        throw ApiError.notFound('User not found');
    }
    res.json({ success: true, data: user });
});
