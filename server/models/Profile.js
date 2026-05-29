import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, default: '' },
    contact: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    passoutYear: { type: String, default: '' },
    collegeName: { type: String, default: '' },
    currentlyStudying: { type: Boolean, default: false },
    designation: { type: String, default: '' },
    companyName: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

/** Returns the snake_case shape the Dashboard page already reads. */
profileSchema.methods.toClient = function toClient() {
  return {
    full_name: this.fullName,
    contact: this.contact,
    degree: this.degree,
    field_of_study: this.fieldOfStudy,
    passout_year: this.passoutYear,
    college_name: this.collegeName,
    currently_studying: this.currentlyStudying,
    designation: this.designation,
    company_name: this.companyName,
    location: this.location,
  };
};

export const Profile = mongoose.model('Profile', profileSchema);
