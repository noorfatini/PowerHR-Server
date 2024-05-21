import mongoose from 'mongoose';

const postingSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HR',
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    quota: Number,

    createdAt: {
        type: Date,
        default: Date.now,
    },

    deadline: Date,

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },

    tags: [
        {
            type: String,
            index: true,
        },
    ],

    salaryRange: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
    },

    qualification: {
        type: String,
        required: true,
    },

    experience: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
    },

    languages: [
        {
            name: String,
            level: {
                type: String,
                enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Mastery', 'Native'],
            },
        },
    ],

    technicalSkills: [
        {
            name: String,
            level: String,
        },
    ],

    softSkills: [
        {
            name: String,
            level: String,
        },
    ],

    gender: {
        type: String,
        enum: ['All', 'Male', 'Female'],
        default: 'All',
    },
});

const Posting = mongoose.model('Posting', postingSchema);

export default Posting;
