import Resume from '../../models/resume/resume.js';

export default async function (fastify, opts) {
    fastify.get('/update', async function (request, reply) {
        try {
            const resume = request.body;

            await Resume.findByIdAndUpdate(resume._id, resume);

            reply.status(200).send({ message: 'Resume updated' });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    });
}
