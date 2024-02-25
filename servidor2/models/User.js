const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },			
    numtel: {type: String, required:true},	
    //usertype: { type: String, enum: ['user', 'admin'],default: 'user'},
    tiposangre: {type: String},
    password: { type: String, required: true },
	},
	{ collection: 'user-data' }
)

/*
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});


*/
const User = mongoose.model('User', userSchema);

module.exports = User;