const express = require('express');
const router = require('express-promise-router')();
// const router = express.Router;
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false});
const passportJWT = passport.authenticate('jwt', { session: false});
const passportGoogle = passport.authenticate('googleToken', { session: false });


router.route('/signUp')
.post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signIn')
.post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.route('/oauth/google')
.post(passportGoogle, UsersController.googleOAuth);

router.route('/secret')
.get(passportJWT, UsersController.secret);

router.route('/profile')
.get(passportJWT, UsersController.profile);

router.route('/profile')
.post(passportJWT, UsersController.update);

module.exports = router;