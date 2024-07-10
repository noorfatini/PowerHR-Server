import mongoose, { Schema } from 'mongoose';

const companySchema = Schema({
    name: {
        type: String,
        required: true,
    },

    description: String,

    page: {
        header: {
            title: String,
            content: String,
        },

        body: {
            title: String,
            content: String,
        },
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

    parentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
});

const Company = mongoose.model('Company', companySchema);

export default Company;
