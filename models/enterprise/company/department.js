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

    underDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
