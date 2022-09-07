/**
 * Configurations => env variables
 * @returns env variables
 */
export const configuration = () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  auth: {
    http_basic_username: process.env.HTTP_BASIC_USERNAME,
    http_basic_password: process.env.HTTP_BASIC_PASSWORD,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
});
