import User from './user.js';
import bcrypt from 'bcrypt';
import Resume from '../resume/resume.js';
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
    {},
    {
        discriminatorKey: '__t',
    },
);

const Applicant = User.discriminator('Applicant', applicantSchema);

export default Applicant;
