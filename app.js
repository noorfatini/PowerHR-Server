import path from 'path';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
const ENV = process.env.NODE_ENV;

import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function (fastify, opts) {
    // Place here your custom code!

    if (ENV !== 'test') {
        const DB_URL = process.env.DB_URL;
        await mongoose
            .connect(DB_URL)
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((err) => {
                console.log('Failed to connect to MongoDB');
                console.error(err);
                throw err;
            });
    }

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts),
    });
}
