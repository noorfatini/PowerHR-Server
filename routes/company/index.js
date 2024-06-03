import ApiError from '../../util/ApiError.js';
import EnterpriseFacade from '../../services/enterprise/enterpriseFacade.js';

class CompanyRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.enterpriseFacade = new EnterpriseFacade();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.post(
            '/register',
            {
                schema: {
                    description: 'Register a new company',
                    tags: ['Company'],
                    body: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            email: { type: 'string' },
                            phone: { type: 'string' },
                            address: {
                                type: 'object',
                                properties: {
                                    street: { type: 'string' },
                                    city: { type: 'string' },
                                    state: { type: 'string' },
                                    zip: { type: 'string' },
                                    country: { type: 'string' },
                                },
                                required: ['street', 'city', 'state', 'zip', 'country'],
                            },
                        },
                        required: ['name', 'email', 'phone', 'address'],
                    },
                },
            },
            this.registerCompany.bind(this),
        );

        this.fastify.post(
            '/check',
            {
                schema: {
                    description: 'Check if a company exists',
                    tags: ['Company'],
                    body: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                        },
                        required: ['email'],
                    },
                },
            },
            this.checkCompany.bind(this),
        );
    }

    async registerCompany(request, reply) {
        try {
            const { name, email, phone, address } = request.body;

            const company = await this.enterpriseFacade.createCompany(name, email, phone, address);

            reply.status(201).send({
                company,
                message: 'Company created',
            });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async checkCompany(request, reply) {
        const { email } = request.body;

        if (!email) {
            return reply.status(400).send({ error: 'Missing fields' });
        }

        const company = await this.enterpriseFacade.isCompanyExist(email);

        if (!company) {
            return reply.send({ exists: false });
        }

        reply.send({ exists: true });
    }
}

export default async function (fastify) {
    new CompanyRoutes(fastify);
}
