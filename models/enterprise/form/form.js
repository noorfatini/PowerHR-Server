import mongoose from 'mongoose';

const formSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },

    collaborator: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    employeeDone: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },
    ],

    name: {
        type: String,
        required: true,
    },

    description: { type: String, default: 'No description' },

    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],

    setting: {
        once: {
            type: Boolean,
            default: false,
        },

        published: {
            type: Boolean,
            default: false,
        },

        dueDate: {
            active: { type: Boolean, default: false },
            date: { type: String, default: '' },
        },

        requiredAll: {
            type: Boolean,
            default: false,
        },
    },
});

const Form = mongoose.model('Form', formSchema);

export default Form;
