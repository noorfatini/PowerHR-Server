import AuthenticationFactory from '../../../models/authentication/authenticationFactory.js';
import ApiError from '../../../util/ApiError.js';

export default async function (fastify, opts) {
    fastify.post(
        '/register',
        {
            schema: {
                description: 'Register an applicant',
                tags: ['Applicants'],
                body: {
                    type: 'object',
                    required: ['email', 'firstName', 'lastName', 'gender', 'password', 'confirmPassword'],
                    properties: {
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        gender: { type: 'string' },
                        password: { type: 'string' },
                        confirmPassword: { type: 'string' },
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
                const authFactory = new AuthenticationFactory();
                const authApplicant = authFactory.createAuthentication('applicant');
                const applicant = await authApplicant.register(data);

                reply.status(201).send({
                    message: 'Applicant registered successfully',
                    applicant: {
                        id: applicant._id,
                    },
                });
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
