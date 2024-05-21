export default async function (fastify, opts) {
    // Note: This is a simple example of a route handler.

    fastify.get('/', async function (request, reply) {
        return { root: true };
    });

    // Scheme for basic route
    fastify.get(
        '/basic',
        {
            schema: {
                description: 'Example of root route',
                tags: ['root'],
                summary: 'Root',
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            root: {
                                type: 'boolean',
                            },
                        },
                    },
                },
            },
        },
        async function (request, reply) {
            return { root: true };
        },
    );

    // Scheme for route with parameter
    fastify.get(
        '/param/:id',
        {
            schema: {
                description: 'Example of parameter route',
                tags: ['root'],
                summary: 'Test',
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The id of the test',
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
        async function (request, reply) {
            return { id: request.params.id };
        },
    );

    // Scheme for route with body
    fastify.post(
        '/body',
        {
            schema: {
                description: 'Example of body route',
                tags: ['root'],
                summary: 'Body',
                body: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'The message to return',
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
        async function (request, reply) {
            return { message: request.body.message };
        },
    );
}
