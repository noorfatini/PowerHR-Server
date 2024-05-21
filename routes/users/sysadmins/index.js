import UserFactory from '../../../models/users/userFactory.js';
import ApiError from '../../../util/ApiError.js';

export default async function (fastify, opts) {
    fastify.post(
        '/register',
        {
            schema: {
                description: 'Register an SysAdmin',
                tags: ['SysAdmins'],
                body: {
                    type: 'object',
                    required: ['email', 'firstName', 'lastName', 'gender', 'password'],
                    properties: {
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        gender: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    400: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    500: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                },
            },
        },
        async function (request, reply) {
            try {
                const data = request.body;
                const userFactory = new UserFactory();
                const sysadmin = await userFactory.createUser('sysadmin', data);
                await userFactory.save(sysadmin);
                reply.status(201).send({ message: 'SysAdmin registered' });
            } catch (error) {
                if (error instanceof ApiError) {
                    return reply.status(error.statusCode).send({ error: error.message });
                } else {
                    request.log.error(error);
                    reply.status(500).send({ error: error.message || 'Something went wrong' });
                }
            }
        },
    );
}
