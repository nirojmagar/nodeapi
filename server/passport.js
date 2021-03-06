const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');//.Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./configuration');
const User = require('./models/user');


// JSON WEB TOKENS STRATEGY
passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
	try{
		//  Find the user apecified in token
		const user = await User.findById(payload.sub);


		// If user doesn't exists, handle it 
		if( !user ) {
			return done(null, false);
		}


		// Otherwise, return the user
		done(null, user);
	} catch( error ) {
		done(error, false);
	}
}));

// Google oauth strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
	clientID: config.oauth.google.clientID,
	clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
	try {
		/*console.log('accessToken', accessToken);
		console.log('refreshToken', refreshToken);
		console.log('profile', profile);*/
		// Check wheather this current user exists in our DB
		const existingUser = await User.findOne({ "google.id":profile.id });
		if( existingUser ){
			console.log('user already exists in out database');
			return done(null, existingUser);
		}

		console.log("user doesn't exists in out database");
		// If new account create it in our DB
		const newUser = new User({
			method: 'google',
			google: {
				id: profile.id,
				email: profile.emails[0].value
			}
		});
		await newUser.save();
		done(null, newUser);
	} catch( error ) {
		done(error, false, error.message);
	}
}));


// facebook oauth strategy
passport.use('facebookToken', new FacebookTokenStrategy({
	clientID: config.oauth.facebook.clientID,
	clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
	try {
		// Check wheather this current user exists in our DB
		const existingUser = await User.findOne({ "facebook.id":profile.id });
		if( existingUser ){
			console.log('user already exists in out database');
			return done(null, existingUser);
		}

		console.log("user doesn't exists in out database");
		// If new account create it in our DB
		const newUser = new User({
			method: 'google',
			facebook: {
				id: profile.id,
				email: profile.emails[0].value
			}
		});
		await newUser.save();
		done(null, newUser);
	} catch( error ) {
		done(error, false, error.message);
	}
}));

// LOCAL STRATEGY
passport.use( new localStrategy({
	usernameField: 'email'
}, async (email, password, done) => {
	try {
		// Find user with given email
		const foundUser = await User.findOne({ "local.email": email });

		// If not , handle it
		if( !foundUser ) {
			return done(null, false);
		}

		// Chaeck if the password is correct
		const isMatch = await foundUser.isValidPassword(password);

		// If not, handle it
		if( !isMatch ) {
			return done(null, false);
		}

		// Otherwise, return the user
		done(null, foundUser);
	} catch( error ) {
		done(error);
	}
}));