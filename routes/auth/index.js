import ApiError from '../../util/ApiError.js';
import AuthFacade from '../../services/auth/authFacade.js';

class AuthRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.authFacade = new AuthFacade();
        this.initRoutes();
    }

    initRoutes() {
        this.fastify.post(
            '/login',
            {
                schema: {
                    description: 'Login',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Login',
                    body: {
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
                                user: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string' },
                                        email: { type: 'string' },
                                        role: { type: 'string' },
                                        firstName: { type: 'string' },
                                        lastName: { type: 'string' },
                                    },
                                },
                                token: { type: 'string' },
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
            this.login.bind(this),
        );

        this.fastify.post(
            '/forgot-password',
            {
                schema: {
                    description: 'Forgot Password',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Forgot Password and send email',
                    body: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                            email: { type: 'string' },
                        },
                    },
                    response: {
                        200: {
                            description: 'Successful response',
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            description: 'Bad Request',
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
            this.forgotPassword.bind(this),
        );

        this.fastify.post(
            '/reset-password',
            {
                schema: {
                    description: 'Reset Password',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Reset Password',
                    body: {
                        type: 'object',
                        required: ['password', 'confirmPassword', 'token'],
                        properties: {
                            password: { type: 'string' },
                            confirmPassword: { type: 'string' },
                            token: { type: 'string' },
                        },
                    },
                    response: {
                        200: {
                            description: 'Successful response',
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            description: 'Bad Request',
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
            this.resetPassword.bind(this),
        );

        this.fastify.get(
            '/verify-token',
            {
                schema: {
                    description: 'Verify Token',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Verify Token',
                    query: {
                        type: 'object',
                        required: ['token'],
                        properties: {
                            token: { type: 'string' },
                        },
                    },
                    response: {
                        200: {
                            description: 'Successful response',
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            description: 'Bad Request',
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
            this.verifyToken.bind(this),
        );

        this.fastify.get(
            '/activate-account',
            {
                schema: {
                    description: 'Activate Account',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Activate Account',
                    query: {
                        type: 'object',
                        required: ['token'],
                        properties: {
                            token: { type: 'string' },
                        },
                    },
                    response: {
                        200: {
                            description: 'Successful response',
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            description: 'Bad Request',
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
            this.activateAccount.bind(this),
        );

        this.fastify.post(
            '/register/applicant',
            {
                schema: {
                    description: 'Register an applicant',
                    tags: ['Applicants', 'Auth'],
                    body: {
                        type: 'object',
                        required: ['email', 'firstName', 'lastName', 'gender', 'password', 'confirmPassword'],
                        properties: {
                            email: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            gender: { type: 'string' },
                            password: { type: 'string' },
                            confirmPassword: { type: 'string' },
                        },
                    },
                    response: {
                        201: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                        500: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                    },
                },
            },
            this.registerApplicant.bind(this),
        );

        this.fastify.post(
            '/register/employee',
            {
                schema: {
                    description: 'Register an Employee',
                    tags: ['Employees', 'Auth'],
                    body: {
                        type: 'object',
                        required: ['email', 'firstName', 'lastName', 'gender', 'companyId', 'jobTitle'],
                        properties: {
                            email: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            gender: { type: 'string' },
                            companyId: { type: 'string' },
                            jobTitle: { type: 'string' },
                        },
                    },
                    response: {
                        201: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                        500: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                    },
                },
            },
            this.registerEmployee.bind(this),
        );

        this.fastify.post(
            '/register/sysadmin',
            {
                schema: {
                    description: 'Register an SysAdmin',
                    tags: ['SysAdmins', 'Auth'],
                    body: {
                        type: 'object',
                        required: ['email', 'firstName', 'lastName', 'gender', 'password'],
                        properties: {
                            email: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            gender: { type: 'string' },
                            password: { type: 'string' },
                        },
                    },
                    response: {
                        201: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                            },
                        },
                        400: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                        500: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' },
                            },
                        },
                    },
                },
            },
            this.registerSysAdmin.bind(this),
        );
    }

    async login(request, reply) {
        try {
            const { email, password } = request.body;

            const user = await this.authFacade.login(email, password);

            const userData = {
                _id: user._id,
                email: user.email,
                role: user.__t,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            const token = await reply.jwtSign(
                {
                    _id: user._id,
                },
                { expiresIn: '1h' },
            );

            return reply.code(200).send({ user: userData, token });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async forgotPassword(request, reply) {
        try {
            const { email } = request.body;

            await this.authFacade.resetPasswordEmail(email);

            return reply.code(200).send({ message: 'Email sent' });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async resetPassword(request, reply) {
        try {
            const { password, confirmPassword, token } = request.body;

            await this.authFacade.resetPassword(token, password, confirmPassword);

            return reply.code(200).send({ message: 'Password reset' });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async verifyToken(request, reply) {
        try {
            const { token } = request.query;

            await this.authFacade.verifyToken(token);

            return reply.code(200).send({ message: 'Token verified' });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async activateAccount(request, reply) {
        try {
            const { token } = request.query;

            await this.authFacade.activate(token);

            return reply.code(200).send({ message: 'Account activated' });
        } catch (error) {
            if (error instanceof ApiError) {
                return reply.status(error.statusCode).send({ error: error.message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: error.message || 'Something went wrong' });
            }
        }
    }

    async registerApplicant(request, reply) {
        try {
            const data = request.body;
            const applicant = this.authFacade.register('applicant', data);

            reply.status(201).send({
                message: 'Applicant registered successfully',
                applicant: {
                    id: applicant._id,
                },
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

    async registerEmployee(request, reply) {
        try {
            const data = request.body;
            const employee = this.authFacade.register('employee', data);

            reply.status(201).send({
                message: 'Employee registered successfully',
                employee: {
                    id: employee._id,
                },
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

    async registerSysAdmin(request, reply) {
        try {
            const data = request.body;
            const sysadmin = this.authFacade.register('sysadmin', data);

            reply.status(201).send({
                message: 'SysAdmin registered successfully',
                sysadmin: {
                    id: sysadmin._id,
                },
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
}

export default async function (fastify) {
    new AuthRoutes(fastify);
}
