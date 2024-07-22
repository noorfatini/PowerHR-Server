import ResumeController from '../../services/resume/resumeController.js';

class ResumeRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.resumeController = new ResumeController();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.get(
            '/update',
            {
                schema: {
                    description: 'Update a resume',
                    tags: ['Resume'],
                },
            },
            this.updateResume.bind(this),
        );
    }

    async updateResume(request, reply) {
        try {
            const resume = request.body;

            await this.resumeController.updateResume(resume);

            reply.status(200).send({ message: 'Resume updated' });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }
}

export default async function (fastify) {
    new ResumeRoutes(fastify);
}
