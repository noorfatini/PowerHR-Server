import Resume from '../../models/resume/resume.js';

class ResumeFacade {
    async createResume(userId) {
        await Resume.create({ user: userId });
    }

    async updateResume(resume) {
        await Resume.findByIdAndUpdate(resume._id, resume);
    }
}

export default ResumeFacade;
