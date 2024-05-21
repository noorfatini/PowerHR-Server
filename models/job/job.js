import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
        required: true,
        index: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true,
    },
    environment: {
        type: String,
        required: true,
        index: true,
    },
    industry: {
        type: String,
        enum: [
            'agriculture',
            'manufacturing',
            'construction',
            'wholesale',
            'retail',
            'transportation',
            'information',
            'finance',
            'real estate',
            'professional',
            'scientific',
            'technical',
            'management',
            'administrative',
            'waste management',
            'remediation',
            'educational',
            'healthcare',
            'arts',
            'entertainment',
            'recreation',
            'accommodation',
            'food services',
            'other',
        ],
        required: true,
        index: true,
    },
});

jobSchema.index({ title: 'text', description: 'text' }); // Add text indexes for full-text search

const Job = mongoose.model('Job', jobSchema);

export default Job;
