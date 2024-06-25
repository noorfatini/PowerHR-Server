import User from './user.js';
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
        },

        personalEmail: {
            type: String,
            required: true,
        },

        jobTitle: {
            type: String,
            required: true,
        },

        reportTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },

        salary: {
            type: Number,
            required: true,
        },

        hireDate: {
            type: Date,
        },

        terminationDate: {
            type: Date,
        },

        contract: {
            type: String,
        },
    },
    {
        discriminatorKey: '__t',
    },
);

employeeSchema.methods.getMe = function () {
    const userObject = this.toObject();
    delete userObject.password;
    userObject.role = userObject.jobTitle;
    delete userObject.__t;
    return userObject;
};

const Employee = User.discriminator('Employee', employeeSchema);

export default Employee;
