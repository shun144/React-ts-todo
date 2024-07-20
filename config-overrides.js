const path = require('path');

module.exports = (config) => {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.alias,
            '@': path.resolve(__dirname, './src/'),
            // '@utils': path.resolve(__dirname, './src/utils/')
        },
        extensions: ['.js', '.ts', '.d.ts', '.tsx']
    };

    return config;
};