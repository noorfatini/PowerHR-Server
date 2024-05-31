import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },

    logo: String,

    email: String,

    phone: String,

    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
