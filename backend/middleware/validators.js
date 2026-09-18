// middleware/validators.js
// Centralized request-body/query validation using express-validator.
// Keeping validation in middleware (rather than scattered ad-hoc checks
// inside controllers) makes the API's contract explicit and consistent.

const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after a validation chain; turns collected errors into a single
// clean 400 response instead of letting bad data reach the controller.
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
        return next(ApiError.badRequest('Validation failed', details));
    }
    next();
};

const registerRules = [
    body('name').trim().notEmpty().withMessage('Full name is required')
        .isLength({ max: 100 }).withMessage('Name is too long'),
    body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate,
];

const loginRules = [
    body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    body('rememberMe').optional().isBoolean().withMessage('Remember me must be a boolean'),
    validate,
];

const googleAuthRules = [
    body('idToken').trim().notEmpty().withMessage('Google idToken is required'),
    body('rememberMe').optional().isBoolean().withMessage('Remember me must be a boolean'),
    validate,
];

const changePasswordRules = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    validate,
];

const updateProfileRules = [
    body('name').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('Name is too long'),
    body('preferredLanguage').optional({ values: 'falsy' }).trim().isLength({ max: 10 }),
    body('state').optional({ values: 'falsy' }).trim().isLength({ max: 60 }),
    body('profile.age').optional({ values: 'falsy' }).isInt({ min: 0, max: 130 }).withMessage('Age must be a realistic number'),
    body('profile.income').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Income must be a positive number'),
    validate,
];

const mongoIdParam = (name = 'id') => [
    param(name).isMongoId().withMessage('Invalid identifier format'),
    validate,
];

const sendMessageRules = [
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ max: 4000 }).withMessage('Message is too long (max 4000 characters)'),
    body('conversationId').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid conversation ID format'),
    body('lang').optional({ values: 'falsy' }).trim().isLength({ max: 5 }),
    validate,
];

const recommendSchemesRules = [
    body('age').optional({ values: 'falsy' }).isInt({ min: 0, max: 130 }).withMessage('Age must be a realistic number'),
    body('income').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Income must be a positive number'),
    body('state').optional({ values: 'falsy' }).trim().isLength({ max: 60 }).withMessage('State name is too long'),
    body('occupation').optional({ values: 'falsy' }).trim().isLength({ max: 50 }).withMessage('Occupation is too long'),
    body('education').optional({ values: 'falsy' }).trim().isLength({ max: 50 }).withMessage('Education is too long'),
    body('category').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Category is too long'),
    body('gender').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Gender is too long'),
    body('isFarmer').optional().isBoolean().withMessage('isFarmer must be a boolean'),
    body('isStudent').optional().isBoolean().withMessage('isStudent must be a boolean'),
    body('isRural').optional().isBoolean().withMessage('isRural must be a boolean'),
    body('isDisability').optional().isBoolean().withMessage('isDisability must be a boolean'),
    body('isBelowPovertyLine').optional().isBoolean().withMessage('isBelowPovertyLine must be a boolean'),
    validate,
];

const listSchemesQueryRules = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    validate,
];

const supportInquiryRules = [
    body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ max: 3000 }).withMessage('Message is too long'),
    body('name').optional().trim().isLength({ max: 100 }),
    body('category').optional().trim().isLength({ max: 80 }).withMessage('Category is too long'),
    validate,
];

module.exports = {
    validate,
    registerRules,
    loginRules,
    googleAuthRules,
    changePasswordRules,
    updateProfileRules,
    mongoIdParam,
    sendMessageRules,
    recommendSchemesRules,
    listSchemesQueryRules,
    supportInquiryRules,
};
