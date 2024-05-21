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

        jobTitle: {
            type: String,
            required: true,
        },

        reportTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },

        access: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Access',
            },
        ],

        activated: {
            type: Boolean,
            default: false,
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
