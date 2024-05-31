import UserFactory from '../../services/users/userFactory.js';
import ApiError from '../../util/ApiError.js';

class UserRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.userFactory = new UserFactory();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.get(
            '/:user/:id',
            {
                schema: {
                    description: 'Get a user by ID',
                    tags: ['User'],
                    params: {
                        type: 'object',
                        properties: {
                            user: { type: 'string' },
                            id: { type: 'string' },
                        },
                        required: ['user', 'id'],
                    },
                },
            },
            this.getUser.bind(this),
        );
    }

    async getUser(request, reply) {
        try {
            const { user, id } = request.params;

            const userObject = await this.userFactory.getUser(user, id);

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
    }
}

export default async function (fastify) {
    new UserRoutes(fastify);
}
