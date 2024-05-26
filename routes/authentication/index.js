import ApiError from '../../util/ApiError.js';
import AuthenticationFactory from '../../models/authentication/authenticationFactory.js';

export default async function (fastify) {
    fastify.get(
        '/login',
        {
            schema: {
                description: 'Login',
                tags: ['Authentication'],
                summary: 'Login',
                query: {
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
                            _id: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string' },
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
                const { email, password } = request.query;

                const authenticationFactory = new AuthenticationFactory();

                const user = await authenticationFactory.login(email, password);

                const userData = {
                    _id: user._id,
                    email: user.email,
                    role: user.__t,
                };

                const token = await reply.jwtSign(
                    {
                        _id: user._id,
                    },
                    { expiresIn: '1h' },
                );

                return reply
                    .setCookie('token', token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .code(200)
                    .send(userData);
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
