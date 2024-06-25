import EnterpriseFacade from '../../services/enterprise/enterpriseFacade.js';

class FormRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.enterpriseFacade = new EnterpriseFacade();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.post(
            '/',
            {
                schema: {
                    description: 'Create a new form',
                    tags: ['Form'],
                    body: {
                        type: 'object',
                        properties: {
                            createdBy: { type: 'string' },
                            company: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                        },
                        required: ['createdBy', 'company', 'name'],
                    },
                },
            },
            this.createForm.bind(this),
        );

        this.fastify.put(
            '/',
            {
                schema: {
                    description: 'Update a form',
                    tags: ['Form'],
                    body: {
                        type: 'object',
                        properties: {
                            form: { type: 'object' },
                        },
                        required: ['form'],
                    },
                },
            },
            this.updateForm.bind(this),
        );

        this.fastify.delete(
            '/:formId',
            {
                schema: {
                    description: 'Delete a form',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            formId: { type: 'string' },
                        },
                        required: ['formId'],
                    },
                },
            },
            this.deleteForm.bind(this),
        );

        this.fastify.get(
            '/user/:userId',
            {
                schema: {
                    description: 'Get forms by user',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string' },
                        },
                        required: ['userId'],
                    },
                },
            },
            this.getFormsByUser.bind(this),
        );

        this.fastify.get(
            '/:formId/snapshot',
            {
                schema: {
                    description: 'Get form by id with snapshot',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            formId: { type: 'string' },
                        },
                        required: ['formId'],
                    },
                },
            },
            this.getFormByIdWithSnapshot.bind(this),
        );

        this.fastify.get(
            '/publish/all/:companyId/:userId',
            {
                schema: {
                    description: 'Get publish forms by company',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            companyId: { type: 'string' },
                            userId: { type: 'string' },
                        },
                        required: ['companyId', 'userId'],
                    },
                },
            },
            this.getPublishFormsByCompany.bind(this),
        );

        this.fastify.get(
            '/publish/:formId',
            {
                schema: {
                    description: 'Get publish form by id',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            formId: { type: 'string' },
                        },
                        required: ['formId'],
                    },
                },
            },
            this.getPublishFormById.bind(this),
        );

        this.fastify.post(
            '/feedbacks/:id/:userId',
            {
                schema: {
                    description: 'Submit a form',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            userId: { type: 'string' },
                        },
                        required: ['id', 'userId'],
                    },
                    body: {
                        type: 'object',
                        properties: {
                            responses: { type: 'array' },
                        },
                        required: ['responses'],
                    },
                },
            },
            this.submitForm.bind(this),
        );

        this.fastify.get(
            '/feedbacks/:formId',
            {
                schema: {
                    description: 'Get feedbacks by form id',
                    tags: ['Form'],
                    params: {
                        type: 'object',
                        properties: {
                            formId: { type: 'string' },
                        },
                        required: ['formId'],
                    },
                },
            },
            this.getFeedbacksByFormId.bind(this),
        );
    }

    async createForm(request, reply) {
        try {
            const { createdBy, company, name, description } = request.body;

            const form = await this.enterpriseFacade.createForm(createdBy, company, name, description);

            reply.status(200).send({ message: 'Form created', form });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async updateForm(request, reply) {
        try {
            const { form } = request.body;

            const updatedForm = await this.enterpriseFacade.updateForm(form);

            reply.status(200).send({ message: 'Form updated', form: updatedForm });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async deleteForm(request, reply) {
        try {
            const { formId } = request.params;

            await this.enterpriseFacade.deleteForm(formId);

            reply.status(200).send({ message: 'Form deleted' });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async getFormsByUser(request, reply) {
        try {
            const { userId } = request.params;

            const forms = await this.enterpriseFacade.getFormsByUser(userId);

            reply.status(200).send({ forms });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async getFormByIdWithSnapshot(request, reply) {
        try {
            const { formId } = request.params;

            const form = await this.enterpriseFacade.getFormByIdWithSnapshot(formId);

            reply.status(200).send({ form });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async getPublishFormsByCompany(request, reply) {
        try {
            const { companyId, userId } = request.params;

            const forms = await this.enterpriseFacade.getPublishFormsByCompany(companyId, userId);

            reply.status(200).send({ forms });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async getPublishFormById(request, reply) {
        try {
            const { formId } = request.params;

            const form = await this.enterpriseFacade.getPublishFormById(formId);

            reply.status(200).send({ form });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async submitForm(request, reply) {
        try {
            const { id, userId } = request.params;
            const { responses } = request.body;

            console.log('responses', responses);
            console.log('id', id);
            console.log('userId', userId);

            await this.enterpriseFacade.submitForm(id, userId, responses);

            reply.status(200).send({ message: 'Form submitted' });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }

    async getFeedbacksByFormId(request, reply) {
        try {
            const { formId } = request.params;

            const feedbacks = await this.enterpriseFacade.getFeedbacksByFormId(formId);

            reply.status(200).send({ feedbacks });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: 'Something went wrong' });
        }
    }
}

export default async function (fastify) {
    new FormRoutes(fastify);
}
