import ApiError from '../../util/ApiError.js';
import AuthController from '../../services/auth/authController.js';

class AuthRoutes {
    constructor(fastify) {
        this.fastify = fastify;
        this.authController = new AuthController();
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
                                changePassword: { type: 'boolean' },
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

        this.fastify.post(
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
                    body: {
                        type: 'object',
                        properties: {
                            password: { type: 'string' },
                            confirmPassword: { type: 'string' },
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

        this.fastify.post(
            '/change-password/:id',
            {
                schema: {
                    description: 'Change Password',
                    tags: ['Auth', 'Authentication'],
                    summary: 'Change Password',
                    params: {
                        type: 'object',
                        required: ['id'],
                        properties: {
                            id: { type: 'string' },
                        },
                    },
                    body: {
                        type: 'object',
                        required: ['oldPassword', 'newPassword', 'confirmPassword'],
                        properties: {
                            oldPassword: { type: 'string' },
                            newPassword: { type: 'string' },
                            confirmPassword: { type: 'string' },
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
            this.changePassword.bind(this),
        );
    }

    async login(request, reply) {
        try {
            const { email, password } = request.body;

            const { user, token } = await this.authController.login(email, password);

            return reply.code(200).send({ user, token });
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

            await this.authController.resetPasswordEmail(email);

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

            await this.authController.resetPassword(token, password, confirmPassword);

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

            const authentication = await this.authController.verifyToken(token);

            return reply
                .code(200)
                .send({ message: 'Token verified', changePassword: authentication.token.activate.changePassword });
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
            const { password, confirmPassword } = request.body;

            await this.authController.activate(token, password, confirmPassword);

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
            const applicant = this.authController.register('applicant', data);

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
            const employee = this.authController.register('employee', data);

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
            const sysadmin = this.authController.register('sysadmin', data);

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

    async changePassword(request, reply) {
        try {
            const { oldPassword, newPassword, confirmPassword } = request.body;
            const { id } = request.params;

            await this.authController.changePassword(id, newPassword, confirmPassword, oldPassword);

            return reply.code(200).send({ message: 'Password changed' });
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
