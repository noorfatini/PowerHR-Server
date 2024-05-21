import UserFactory from '../../models/users/userFactory.js';
import ApiError from '../../util/ApiError.js';

export default async function (fastify) {
    fastify.get('/:user/:id', async function (request, reply) {
        try {
            const { user, id } = request.params;

            const userFactory = new UserFactory();

            const userObject = await userFactory.getUser(user, id);

            if (!userObject) {
                return reply.status(404).send({ error: `${user} not found` });
            }

            return reply.send(userObject);
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    });
}
