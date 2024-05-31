import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default fp(async (fastify) => {
    fastify.register(jwt, {
        secret: JWT_SECRET,
        cookie: {
            cookieName: 'token',
            signed: false,
        },
        sign: {
            algorithm: 'HS256',
            expiresIn: '20s',
        },
    });
});
