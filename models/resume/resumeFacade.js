import Resume from './resume.js';

class ResumeFacade {
    async createResume(userId) {
        await Resume.create({ user: userId });
    }
}

export default ResumeFacade;
