const { signup, login } = require('../controller/authController');
// const { validateRegistration, validateLogin } = require('../validator');

const router = require('express').Router();

// router.route('/register').post(validateRegistration,signup)
router.route('/register').post(signup)
router.route('/login').post( login)
// router.route('/login').post( validateLogin, login)

module.exports = router;