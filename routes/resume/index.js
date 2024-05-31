import ResumeFacade from '../../services/resume/resumeFacade.js';

class ResumeRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.resumeFacade = new ResumeFacade();
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

            await this.resumeFacade.updateResume(resume);

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
