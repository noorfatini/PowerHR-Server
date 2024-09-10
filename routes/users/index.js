import UserFactory from '../../services/users/userFactory.js';
import ApiError from '../../util/ApiError.js';
import Firebase from '../../util/Firebase.js';

class UserRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.userFactory = new UserFactory();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.get(
            '/:role/:id',
            {
                schema: {
                    description: 'Get a user by ID',
                    tags: ['User'],
                    params: {
                        type: 'object',
                        properties: {
                            role: { type: 'string' },
                            id: { type: 'string' },
                        },
                        required: ['role', 'id'],
                    },
                },
            },
            this.getUser.bind(this),
        );

        this.fastify.put(
            '/:role/:id',
            {
                schema: {
                    description: 'Update a user by ID',
                    tags: ['User'],
                    params: {
                        type: 'object',
                        properties: {
                            role: { type: 'string' },
                            id: { type: 'string' },
                        },
                        required: ['role', 'id'],
                    },
                    body: {
                        type: 'object',
                        properties: {
                            user: { type: 'object' },
                        },
                        required: ['user'],
                    },
                },
            },
            this.updateUser.bind(this),
        );

        this.fastify.post(
            '/upload/profile-picture/:id',
            {
                schema: {
                    description: 'Upload a profile picture for a user',
                    tags: ['User'],
                    consumes: ['multipart/form-data'],
                    params: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                        },
                        required: ['id'],
                    },
                    body: {
                        type: 'object',
                        properties: {
                            file: { isFile: true },
                        },
                        required: ['file'],
                    },
                },
            },
            this.uploadProfilePicture.bind(this),
        );
    }

    async getUser(request, reply) {
        try {
            const { role, id } = request.params;

            const userObject = await this.userFactory.getUser(role, id);

            if (!userObject) {
                return reply.status(404).send({ error: `${role} not found` });
            }

            return reply.send(userObject);
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async updateUser(request, reply) {
        try {
            const { role, id } = request.params;
            const { user } = request.body;

            const updatedUser = await this.userFactory.update(role, id, user);

            return reply.send(updatedUser);
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async uploadProfilePicture(request, reply) {
        const id = request.params.id;
        const data = await request.body.file.toBuffer();

        const fileName = request.body.file.filename;
        const metadata = {
            contentType: request.body.file.mimetype,
        };

        if (metadata.contentType !== 'image/jpeg' && metadata.contentType !== 'image/png') {
            return reply.status(400).send({ error: 'Invalid file type' });
        }

        const fileBuffer = Buffer.from(data);

        const firebase = await Firebase.getInstance();

        const url = await firebase.uploadFile(fileName, fileBuffer, metadata);

        const user = await this.userFactory.update('user', id, {
            profilePicture: url,
        });

        return reply.send(user);
    }
}

export default async function (fastify) {
    new UserRoutes(fastify);
}
