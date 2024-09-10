import fastifySwaggerUi from '@fastify/swagger-ui';
import swagger from '@fastify/swagger';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'PowerHR API',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0',
            },
            consumes: ['application/json', 'multipart/form-data'],
        },
    });

    fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                next();
            },
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    });
});
