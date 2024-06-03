import mongoose from 'mongoose';

const authenticationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    active: {
        type: Boolean,
        default: false,
    },

    token: {
        reset: {
            token: String,
            counter: {
                type: Number,
                default: 0,
            },
        },

        activate: {
            token: String,
            changePassword: {
                type: Boolean,
                default: false,
            },
        },
    },
});

const Authentication = mongoose.model('Authentication', authenticationSchema);

export default Authentication;
