import EnterpriseFacade from '../../services/enterprise/enterpriseFacade.js';
import ApiError from '../../util/ApiError.js';

class LogRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.enterpriseFacade = new EnterpriseFacade();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.get(
            '/:companyId',
            {
                schema: {
                    description: 'Get company logs',
                    tags: ['Log'],
                    params: {
                        companyId: { type: 'string' },
                    },
                },
            },
            this.getLogs.bind(this),
        );
    }

    async getLogs(request, reply) {
        const { companyId } = request.params;

        try {
            const logs = await this.enterpriseFacade.getCompanyLogs(companyId);
            reply.send(logs);
        } catch (error) {
            reply.status(500).send(new ApiError(500, error.message));
        }
    }
}

export default async function (fastify) {
    new LogRoutes(fastify);
}
