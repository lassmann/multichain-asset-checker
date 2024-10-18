import packageJson from "../../package.json";

export const ENV = {
  MODE: process.env.NODE_ENV,
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  VERSION: packageJson.version,
  DYNAMIC_ENV_ID: process.env.NEXT_PUBLIC_DYNAMIC as string,
  GOLDRUSH_ID: process.env.NEXT_PUBLIC_GOLDRUSH as string
};
