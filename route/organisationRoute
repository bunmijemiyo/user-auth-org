const { authentication, restrictTo } = require('../controller/authController');
const { getAllUser, getUser, getUserById } = require('../controller/userController');
const { getAllOrganisations, getOrganisationById, createOrganisation, addUserToOrg } = require('../controller/organisationController');

const router = require('express').Router();

router.route('/').get( authentication, getAllOrganisations);
router.route('/:Id').get(authentication, getOrganisationById);
// router.route('/').get(authentication, getAllUser);

router.route('/').post( authentication, createOrganisation);
router.route('/:orgId/users').post(authentication, addUserToOrg)

module.exports = router;