import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export default class Jwt {
    /**
     * Generate a JWT token
     * @param {object} payload - Payload to be included in the token
     * @param {string} expiresIn - Token expiration time
     * @returns {string} - JWT token
     */
    static generateToken(payload, expiresIn) {
        return jwt.sign(payload, secret, { expiresIn });
    }

    /**
     * Verify a JWT token
     * @param {string} token - JWT token
     * @returns {object} - Decoded token
     */
    static verifyToken(token) {
        return jwt.verify(token, secret);
    }
}
