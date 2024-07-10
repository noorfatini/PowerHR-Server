import auth from '@fastify/auth';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.decorate('verifyToken', async function (request, reply) {
        const { token } = request.cookies;

        if (!token) {
            return reply.code(401).send({ error: 'No token provided' });
        }

        try {
            await request.jwtVerify({ onlyCookie: true });
        } catch (err) {
            return reply.code(401).send({ error: 'Expired token' });
        }
    });

    fastify.register(auth);
});
