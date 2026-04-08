import Joi from "joi";

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  USER_PORT: Joi.number().default(3001),
  PORT: Joi.number().default(3001),
  APP_DEBUG: Joi.boolean().default(false),
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "debug")
    .default("info"),
  DATABASE_URL: Joi.string().required().description("Database connection URL"),
  APP_SECRET: Joi.string().required().description("Application secret"),
  JWT_ACCESS_SECRET: Joi.string().required().description("JWT access secret"),
  JWT_REFRESH_SECRET: Joi.string().required().description("JWT refresh secret"),
  ACCESS_TOKEN_TTL: Joi.string().default("15m"),
  REFRESH_TOKEN_TTL: Joi.string().default("7d"),
  ISSUER_BASE_URL: Joi.string().uri().optional().allow(""),
  AUDIENCE: Joi.string().optional().allow(""),
  DEFAULT_PAGE_SIZE: Joi.number().default(10),
  CONSOLE_LOG_EMAILS: Joi.boolean().default(true),
  MAIL_MAILER: Joi.string().default("smtp"),
  MAIL_HOST: Joi.string().allow(""),
  MAIL_PORT: Joi.number().default(0),
  MAIL_USERNAME: Joi.string().allow(""),
  MAIL_PASSWORD: Joi.string().allow(""),
  ADMIN_EMAIL: Joi.string().email().default("admin@example.com"),
  CORS_ORIGINS: Joi.string().default("http://localhost:5173,http://localhost:5174,http://localhost:5175"),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow(""),
  CLOUDINARY_API_KEY: Joi.string().allow(""),
  CLOUDINARY_API_SECRET: Joi.string().allow(""),
  DELIVERY_CHARGE: Joi.number().default(0),
  TAX_PERCENTAGE: Joi.number().default(0),
  MIN_ORDER_AMOUNT: Joi.number().default(0),
})
  .unknown()
  .required();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.USER_PORT || envVars.PORT,
  debug: envVars.APP_DEBUG,
  logLevel: envVars.LOG_LEVEL,
  consoleLogEmails: envVars.CONSOLE_LOG_EMAILS,
  defaultPageSize: envVars.DEFAULT_PAGE_SIZE,
  appSecret: envVars.APP_SECRET,
  jwtAccessSecret: envVars.JWT_ACCESS_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtAccessExpires: envVars.ACCESS_TOKEN_TTL,
  jwtRefreshExpires: envVars.REFRESH_TOKEN_TTL,
  issuerBaseUrl: envVars.ISSUER_BASE_URL,
  audience: envVars.AUDIENCE,
  mail: {
    mailer: envVars.MAIL_MAILER,
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    username: envVars.MAIL_USERNAME,
    password: envVars.MAIL_PASSWORD,
  },
  adminEmail: envVars.ADMIN_EMAIL,
  corsOrigins: envVars.CORS_ORIGINS.split(",").map((o: string) => o.trim().replace(/^"(.*)"$/, '$1')),
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  business: {
    deliveryCharge: envVars.DELIVERY_CHARGE,
    taxPercentage: envVars.TAX_PERCENTAGE,
    minOrderAmount: envVars.MIN_ORDER_AMOUNT,
  },
};

export default config;
