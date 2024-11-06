import { env } from 'process';

export const AppConfig = async () => {
  return {
    name: env.APP_NAME,
    url: env.APP_URL,
    fullName: env.APP_FULLNAME,
    debug: true,
    env: env.NODE_ENV,
    key: env.APP_KEY,
    verbose: true,
  };
};
