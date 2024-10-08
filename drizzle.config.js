/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
    url: 'postgresql://talonai_owner:L5PWErCn6gzh@ep-gentle-haze-a5dxm2cv.us-east-2.aws.neon.tech/talonai?sslmode=require',
    }
};