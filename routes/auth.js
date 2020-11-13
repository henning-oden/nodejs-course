const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password', 'Please enter a password at least 5 characters long containing only letters and numbers.')
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    authController.postLogin);

router.post(
    '/signup',
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden.');
            // }
            // return true;
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('User with this email already exists.');
                    }
                }
                )
        })
        .normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
        )
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        }),
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;