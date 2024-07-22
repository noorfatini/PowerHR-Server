import User from './user.js';
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
    {
        resume: {
            type: String,
        },
        appliedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
    },
    {
        discriminatorKey: '__t',
    },
);

const Applicant = User.discriminator('Applicant', applicantSchema);

export default Applicant;
