import ApplicantAuthentication from './applicantAuthentication.js';
import UserFactory from '../users/userFactory.js';
import ApiError from '../../util/ApiError.js';
import bcrypt from 'bcrypt';

class AuthenticationFactory {
    constructor() {
        this.userFactory = new UserFactory();
    }

    createAuthentication(role) {
        switch (role) {
            case 'applicant':
                return new ApplicantAuthentication();
            default:
                throw new Error('Invalid role');
        }
    }

    async login(email, password) {
        const user = await this.userFactory.findOne('user', { email });

        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            throw new ApiError(401, 'Invalid email or password');
        }

        return user;
    }

    async resetPasswordEmail(email) {
        const token = await this.userFactory.resetPasswordEmail(email);

        return token;
    }

    async resetPassword(token, password, confirmPassword) {
        const user = await this.userFactory.resetPassword(token, password, confirmPassword);

        return user;
    }

    async verifyResetToken(token) {
        const verify = await this.userFactory.verifyResetToken(token);

        return verify;
    }
}

export default AuthenticationFactory;
