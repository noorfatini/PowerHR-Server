import User from './user.js';
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
    {},
    {
        discriminatorKey: '__t',
    },
);

const Applicant = User.discriminator('Applicant', applicantSchema);

export default Applicant;
