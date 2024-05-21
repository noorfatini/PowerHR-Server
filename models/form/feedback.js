import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema({
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'form',
    },

    responses: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
            },
            answers: [
                {
                    text: String,
                    optionIndex: Number,
                },
            ],
        },
    ],

    draft: { type: Boolean, default: false },

    date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
