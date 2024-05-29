import { describe, it, expect } from 'vitest';
import app from '../../setup.js';

describe.concurrent('routes/authentication/index.js', () => {
    // it('Login as applicant', async () => {
    //     // expect to fail
    //     expect(true).toBe(false);
    // });

    // it('Login as employee', async () => {
    //     // expect to fail
    //     expect(true).toBe(false);
    // });

    // it('Login as sysadmin', async () => {
    //     // expect to fail
    //     expect(true).toBe(false);
    // });

    it('Login with invalid email', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/authentication/login',
            payload: { email: 'invalid', password: 'password' },
        });
        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({ error: 'Invalid email or password' });
    });

    it('Login with invalid password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/authentication/login',
            payload: { email: 'powerhr@test.com', password: 'invalid' },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({ error: 'Invalid email or password' });
    });
});
