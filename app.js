import path from 'path';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'url';

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const DB_URL = process.env.DB_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function (fastify, opts) {
    // Place here your custom code!

    // Connect to MongoDB
    mongoose
        .connect(DB_URL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.log('Failed to connect to MongoDB');
            console.error(err);
        });

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
