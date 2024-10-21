import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
  Env: process.env.ENV,
  Auth: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessLifespan: process.env.JWT_ACCESS_LIFESPAN,
    jwtRefreshLifespan: process.env.JWT_REFRESH_LIFESPAN,
  },

  Database: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  Hash: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  },

  Host: {
    port: parseInt(process.env.PORT || '3000'),
  },
}));
