import ApplicantAuthentication from './applicantAuthentication.js';
import UserFactory from '../users/userFactory.js';
import ApiError from '../../util/ApiError.js';
import bcrypt from 'bcrypt';

class AuthenticationFactory {
    createAuthentication(role) {
        switch (role) {
            case 'applicant':
                return new ApplicantAuthentication();
            default:
                throw new Error('Invalid role');
        }
    }

    async login(email, password) {
        const userFactory = new UserFactory();
        const user = await userFactory.findOne('user', { email });

        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return new ApiError(401, 'Invalid email or password');
        }

        return user;
    }
}

export default AuthenticationFactory;
