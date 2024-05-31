import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },

    questionType: {
        type: String,
        enum: ['Multiple Choice', 'Short Answer', 'Paragraph', 'Checkboxes', 'Drop-down', 'Linear Scale'],
        default: 'Multiple Choice',
    },

    image: { type: String, default: '' },

    required: { type: Boolean, default: false },

    options: [
        {
            optionText: String,
            optionImage: { type: String, default: '' },
            optionScale: String,
        },
    ],

    active: {
        type: Boolean,
        default: true,
    },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
