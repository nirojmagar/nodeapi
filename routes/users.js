const express = require('express');
const router = require('express-promise-router')();
// const router = express.Router;
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');


router.route('/signUp')
.post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signIn')
.post(validateBody(schemas.authSchema), passport.authenticate('local',{ session: false}), UsersController.signIn);

router.route('/oauth/google')
.post(passport.authenticate('googleToken', { session: false }));

router.route('/secret')
.get(passport.authenticate('jwt', { session: false}), UsersController.secret);

router.route('/profile')
.get(passport.authenticate('jwt', { session: false}), UsersController.profile);

router.route('/profile')
.post(passport.authenticate('jwt', { session: false}), UsersController.update);

module.exports = router;