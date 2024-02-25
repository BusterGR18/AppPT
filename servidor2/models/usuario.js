const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		quote: { type: String },
        usertype: { type: String, enum: ['user', 'admin'],default: 'user'},
	},
	{ collection: 'user-data' }
)


//Hasheo Inicial
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
  
  //Hasheo de comparacion
  userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  

const model = mongoose.model('UserData', User)

module.exports = User;