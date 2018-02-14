const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;


// Create a schema
const userSchema = new schema({
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true
	},
	local: {
		email: {
			type: String,
			lowercase: true
		},
		password: {
			type: String
		}
	},
	google: {
		id: {
			type: String
		},
		email: {
			type: String,
			lowercase: true
		}
	},
	facebook: {
		id: {
			type: String
		},
		email: {
			type: String,
			lowercase: true
		}
	}

});


// implement bcrypt 
userSchema.pre('save', async function(next) {
	try {
		if( this.method !== 'local' ){
			next();
		}
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		// Generate a password has ( salt + hash )
		// const passwordHash = await bcrypt.hash(this.password, salt);
		this.local.password = await bcrypt.hash(this.local.password, salt);//passwordHash;
		// console.log('salt', salt);
		// console.log('normal password', this.password);
		// console.log('hashed password', passwordHash);
		next();
	} catch( error ) {
		next(error);
	}
});


userSchema.methods.isValidPassword = async function(newPassword) {
	try {
		const result =  await bcrypt.compare(newPassword, this.local.password);
		return result;
	} catch( error ) {
		throw new Error(error);
	}
}

// Create a model put singular name
const user = mongoose.model('user', userSchema);

// Export the model
module.exports = user;