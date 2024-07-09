const { authentication, restrictTo } = require('../controller/authController');
const { getAllUser, getUser, getUserById } = require('../controller/userController');

const router = require('express').Router();

router.route('/').get(authentication, getAllUser);
router.route('/:Id').get(authentication, getUserById);
// router.route('/').get(authentication, getAllUser);

module.exports = router;