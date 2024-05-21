import Authentication from './authentication.js';
import UserFactory from '../users/userFactory.js';
import ResumeFacade from '../resume/resumeFacade.js';

class ApplicantAuthentication extends Authentication {
    async register(userData) {
        const userFactory = new UserFactory();
        const applicant = await userFactory.createUser('applicant', userData);
        await userFactory.save(applicant);
        const resumeFacade = new ResumeFacade();
        await resumeFacade.createResume(applicant._id);

        return applicant;
    }
}

export default ApplicantAuthentication;
