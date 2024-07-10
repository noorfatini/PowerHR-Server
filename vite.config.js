import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        setupFiles: ['./test/setup.js'],
        reporters: ['junit', 'json', 'verbose'],
        outputFile: {
            junit: './report/junit-report.xml',
            json: './report/json-report.json',
        },
    },
});
