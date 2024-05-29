import Applicant from './applicant.js';
import Employee from './employee.js';
import User from './user.js';
import SysAdmin from './sysadmin.js';
import ApiError from '../../util/ApiError.js';
import Jwt from '../../util/Jwt.js';
import Email from '../../util/Email.js';

const frontEndUrl = process.env.FRONTEND_URL;

class UserFactory {
    async createUser(role, args) {
        const { firstName, lastName, email, gender, password, confirmPassword, companyId, jobTitle } = args;

        const userExists = await User.exists({ email });

        if (userExists) {
            throw new ApiError(400, 'User already exists');
        }

        switch (role) {
            case 'applicant':
                if (password !== confirmPassword) {
                    throw new ApiError(400, 'Passwords do not match');
                }

                if (password.length < 8) {
                    throw new ApiError(400, 'Password must be at least 8 characters long');
                }

                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
                    throw new ApiError(
                        400,
                        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                    );
                }

                return new Applicant({ email, firstName, lastName, password, gender });
            case 'employee':
                return new Employee({
                    firstName,
                    lastName,
                    email,
                    gender,
                    password: '123456',
                    company: companyId,
                    jobTitle: jobTitle || 'Unassigned',
                });
            case 'sysadmin':
                return new SysAdmin({
                    firstName,
                    lastName,
                    gender,
                    email,
                    password,
                });
            case 'user':
                return new User(args);
            default:
                throw new ApiError(400, 'Invalid role');
        }
    }

    async findOne(role, args) {
        switch (role) {
            case 'applicant':
                return Applicant.findOne(args);
            case 'employee':
                return Employee.findOne(args);
            case 'sysadmin':
                return SysAdmin.findOne(args);
            case 'user':
                return User.findOne(args).exec();
            default:
                throw new ApiError(400, 'Invalid role');
        }
    }

    async find(role, args) {
        switch (role) {
            case 'applicant':
                return Applicant.find(args);
            case 'employee':
                return Employee.find(args);
            case 'sysadmin':
                return SysAdmin.find(args);
            case 'user':
                return User.find(args);
            default:
                throw new ApiError(400, 'Invalid role');
        }
    }

    async findById(id) {
        const user = await User.findById(id);

        return user;
    }

    async findByIdAndUpdate(id, update) {
        const user = await User.findByIdAndUpdate(id, update);

        return user;
    }

    async save(user) {
        await user.save();
    }

    async comparePassword(user, password) {
        const compare = await user.comparePassword(password);

        return compare;
    }

    async changePassword(id, oldPassword, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'Passwords do not match');
        }

        if (newPassword.length < 8) {
            throw new ApiError(400, 'Password must be at least 8 characters long');
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(newPassword)) {
            throw new ApiError(
                400,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            );
        }

        const user = await User.findById(id);

        const compare = await user.comparePassword(oldPassword);

        if (!compare) {
            throw new ApiError(400, 'Incorrect password');
        }

        user.password = newPassword;

        await user.save();
    }

    async resetPasswordEmail(email) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(400, 'User not found');
        }

        if (user.token.reset.token) {
            try {
                Jwt.verifyToken(user.token.reset.token);

                if (user.token.reset.counter >= 3) {
                    throw new ApiError(400, 'Too many requests. Please try again after 1 hour');
                }

                if (user.token.reset.counter === undefined) {
                    user.token.reset.counter = 0;
                }

                user.token.reset.counter += 1;
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    user.token.reset.token = undefined;
                    user.token.reset.counter = 0;
                } else {
                    throw error;
                }
            }
        }

        const newtoken = Jwt.generateToken({ email }, '1h');

        user.token.reset.token = newtoken;

        await user.save();

        // Email password reset link
        const subject = 'Password Reset';
        const text = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${frontEndUrl}/reset-password?token=${newtoken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        await Email.sendEmail(email, subject, text);

        return newtoken;
    }

    async resetPassword(token, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'Passwords do not match');
        }

        if (newPassword.length < 8) {
            throw new ApiError(400, 'Password must be at least 8 characters long');
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(newPassword)) {
            throw new ApiError(
                400,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            );
        }

        const user = await User.findOne({ 'token.reset.token': token });

        if (!user) {
            throw new ApiError(400, 'Invalid token');
        }

        try {
            Jwt.verifyToken(token);
        } catch (error) {
            throw new ApiError(400, 'Token expired');
        }

        user.password = newPassword;
        user.token.reset.token = undefined;
        user.token.reset.counter = 0;

        await user.save();
    }

    async verifyResetToken(token) {
        const user = await User.findOne({ 'token.reset.token': token });

        if (!user) {
            throw new ApiError(400, 'Invalid token');
        }

        try {
            Jwt.verifyToken(token);
        } catch (error) {
            throw new ApiError(400, 'Token expired');
        }

        return true;
    }
}

export default UserFactory;
