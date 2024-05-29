import ApiError from '../../util/ApiError.js';
import AuthenticationFactory from '../../models/authentication/authenticationFactory.js';

export default async function (fastify) {
    fastify.post(
        '/login',
        {
            schema: {
                description: 'Login',
                tags: ['Authentication'],
                summary: 'Login',
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            user: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    email: { type: 'string' },
                                    role: { type: 'string' },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                },
                            },
                            token: { type: 'string' },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
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
                const { email, password } = request.body;

                const authenticationFactory = new AuthenticationFactory();

                const user = await authenticationFactory.login(email, password);

                const userData = {
                    _id: user._id,
                    email: user.email,
                    role: user.__t,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };

                const token = await reply.jwtSign(
                    {
                        _id: user._id,
                    },
                    { expiresIn: '1h' },
                );

                return reply.code(200).send({ user: userData, token });
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

    fastify.post(
        '/forgot-password',
        {
            schema: {
                description: 'Forgot Password',
                tags: ['Authentication'],
                summary: 'Forgot Password and send email',
                body: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
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
                const { email } = request.body;

                const authenticationFactory = new AuthenticationFactory();

                await authenticationFactory.resetPasswordEmail(email);

                return reply.code(200).send({ message: 'Email sent' });
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

    fastify.post(
        '/reset-password',
        {
            schema: {
                description: 'Reset Password',
                tags: ['Authentication'],
                summary: 'Reset Password',
                body: {
                    type: 'object',
                    required: ['password', 'confirmPassword', 'token'],
                    properties: {
                        password: { type: 'string' },
                        confirmPassword: { type: 'string' },
                        token: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
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
                const { password, confirmPassword, token } = request.body;

                const authenticationFactory = new AuthenticationFactory();

                await authenticationFactory.resetPassword(token, password, confirmPassword);

                return reply.code(200).send({ message: 'Password reset' });
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

    fastify.get(
        '/verify-token',
        {
            schema: {
                description: 'Verify Token',
                tags: ['Authentication'],
                summary: 'Verify Token',
                query: {
                    type: 'object',
                    required: ['token'],
                    properties: {
                        token: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
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
                const { token } = request.query;

                const authenticationFactory = new AuthenticationFactory();

                await authenticationFactory.verifyResetToken(token);

                return reply.code(200).send({ message: 'Token verified' });
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
