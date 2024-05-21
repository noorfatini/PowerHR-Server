import mongoose, { Schema } from 'mongoose';

const companySchema = Schema({
    name: {
        type: String,
        required: true,
    },

    createdDate: {
        type: Date,
        default: Date.now,
    },

    logo: String,

    email: {
        type: String,
        required: true,
    },

    phone: String,

    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },

    website: String,

    sector: {
        type: String,
        enum: ['public', 'private', 'other'],
        index: true,
    },

    active: {
        until: {
            type: Date,
            required: true,
        },
    },

    payment: {
        cardNumber: String,
        expiryDate: String,
        cvc: String,
        nameOnCard: String,
        zip: String,

        history: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                ref: {
                    type: String,
                    required: true,
                },
            },
        ],
    },

    branch: {
        isBranch: { type: Boolean, default: false },
        parentCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
});

const Company = mongoose.model('Company', companySchema);

export default Company;
