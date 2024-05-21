import UserFactory from '../../../models/users/userFactory.js';
import ApiError from '../../../util/ApiError.js';

export default async function (fastify) {
    fastify.post(
        '/register',
        {
            schema: {
                description: 'Register an Employee',
                tags: ['Employees'],
                body: {
                    type: 'object',
                    required: ['email', 'firstName', 'lastName', 'gender', 'companyId', 'jobTitle'],
                    properties: {
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        gender: { type: 'string' },
                        companyId: { type: 'string' },
                        jobTitle: { type: 'string' },
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
                const employee = await userFactory.createUser('employee', data);
                await userFactory.save(employee);
                reply.status(201).send({ message: 'Employee registered' });
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
