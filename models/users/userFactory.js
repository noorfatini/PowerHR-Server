import Applicant from './applicant.js';
import Employee from './employee.js';
import User from './user.js';
import SysAdmin from './sysadmin.js';
import ApiError from '../../util/ApiError.js';
import ResumeFacade from '../resume/resumeFacade.js';

class UserFactory {
    constructor() {
        this.resumeFacade = new ResumeFacade();
    }

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

    async register(role, args) {
        const user = await this.createUser(role, args);

        if (role === 'applicant') {
            await user.save();
            await this.resumeFacade.createResume(user._id);
        } else {
            await user.save();
        }

        return user;
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

    async changePassword(id, newPassword, confirmPassword, oldPassword = null) {
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

        if (oldPassword) {
            const compare = await user.comparePassword(oldPassword);

            if (!compare) {
                throw new ApiError(400, 'Incorrect password');
            }
        }

        user.password = newPassword;

        await user.save();
    }
}

export default UserFactory;
