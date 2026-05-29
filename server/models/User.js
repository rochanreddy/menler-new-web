import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: '' },
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },

    provider: { type: String, enum: ['email', 'google'], default: 'email' },
    googleId: { type: String, default: '' },
    picture: { type: String, default: '' },

    emailVerified: { type: Boolean, default: false },

    // Email-verification OTP
    otpCode: { type: String, default: '' },
    otpExpires: { type: Date, default: null },

    // Password-reset token
    resetTokenHash: { type: String, default: '' },
    resetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

/** Shape returned to the client — never leaks secrets. */
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    email: this.email,
    full_name: this.fullName,
    phone: this.phone,
    picture: this.picture,
    provider: this.provider,
    email_verified: this.emailVerified,
  };
};

export const User = mongoose.model('User', userSchema);
