import ApplicantAuthentication from './applicantAuthentication.js';

class AuthenticationFactory {
    createAuthentication(role) {
        switch (role) {
            case 'applicant':
                return new ApplicantAuthentication();
            default:
                throw new Error('Invalid role');
        }
    }
}

export default AuthenticationFactory;
