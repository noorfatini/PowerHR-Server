import fastify from 'fastify';

const app = fastify({
    logger: true,
});

app.get('/test', function (request, reply) {
    reply.send({
        status: 'OK',
    });
});

app.register(import('../app.js'));

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
};
