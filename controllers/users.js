const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
	return JWT.sign({
			iss: 'can be name or name of out server or app',
			sub: user.id,
			iat: new Date().getTime(),// current time
			exp: new Date().setDate(new Date().getDate()+1) //current time + 1 day ahead
		}, JWT_SECRET);
};

module.exports = {
	signUp: async (req, res, next) => {
		// const email = req.value.body.email;
		// const password = req.value.body.password;
		const { email, password } = req.value.body;


		// Check if there is a user with the same email
		// const foundUser = User({email: email});
		// ES6 : if key and value reference have same name then we can do 
		const foundUser = await User.findOne({ email });
		if( foundUser ){
			return res.status(403).json({error: 'Email already in use'});// 403 : forbidden
		}

		// Create a new user
		// const newUser = new User({
			// email: email,
			// password: password
		// });
		// ES6 : if key and value reference have same name then we can do 
		const newUser = new User({ email, password });
		await newUser.save();

		// respond with token
		/*const token = JWT.sign({
			iss: 'can be name or name of out server or app',
			sub: newUser.id,
			iat: new Date().getTime(),// current time
			exp: new Date().setDate(new Date().getDate()+1) //current time + 1 day ahead
		}, 'apiauthentication secret');*/


		// generate token
		const token = signToken(newUser);

		// respond with token
		res.status(200).json({ token }); 
	},

	signIn: async (req, res, next) => {
		// Generate token
		const token = signToken(req.user);	
		res.status(200).json({ token });
	},

	secret: async (req, res, next) => {
		// Protected area ogin required
		res.json({ secret: "Resource" });
	},

	profile: async (req, res, next) => {
		res.json({ secret: "profile" });
	},

	update: async (req, res, next) => {
		res.json({ secret: "updated" });
	},
}