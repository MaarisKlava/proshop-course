import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // this.password is the password from the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving to database
// pre stands for previous - this runs before saving to database
userSchema.pre('save', async function (next) {
  // if password is not modified, skip (middleware for mongoose)
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // this.password is the password from the database
});

const User = mongoose.model('User', userSchema);

export default User;
