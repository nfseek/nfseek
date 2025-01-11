const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
    disable: PHASE_DEVELOPMENT_SERVER,
    dest: "public",
    register: true,
    skipWaiting: false,
    runtimeCaching,
});

module.exports = (phase) => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER;
    const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
    const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

    const env = {
        API_URL: isDev ? process.env.API_URL_LOCAL : process.env.API_URL_LIVE,
        APP_URL: isDev ? process.env.APP_URL_LOCAL : process.env.APP_URL_LIVE,
        tableDataPerPage: isDev ? 10 : 12,
        s3URL: process.env.S3_URL,
        tinymce_key: process.env.TINYMCE_KEY,
        mongodburl: process.env.MONGODB_URL,
        dbtblPrefix: process.env.DB_TABLE_PREFIX,
        SESSION_SECRET: process.env.SESSION_SECRET,
        SITE_TITLE: process.env.SITE_TITLE,
        Mandrill_key: process.env.MANDRILL_KEY,
        aws: {
            bucket: process.env.AWS_BUCKET,
            configuration: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            },
        }
    };

    const nextConfig = withPWA({
        reactStrictMode: true,
        env: env,
        images: {
            domains: ['media.qrtiger.com'],
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
        swcMinify: false,
    });

    return nextConfig;
};
