import { env } from 'process';

export const MailConfig = async () => {
  return {
    from: { name: env.MAIL_FROM_NAME, address: env.MAIL_FROM_ADDRESS },
  };
};

export const MailerConfig = () => {
  return {
    mailerConfig: {
      host: env.MAIL_HOST_URL,
      port: parseInt(env.MAIL_HOST_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: env.MAIL_USERNAME,
        pass: env.MAIL_PASSWORD,
      },
    },
  };
};
