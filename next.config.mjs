/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    compiler: {
      styledComponents: true
    },
    images: {
      remotePatterns: []
    },
    /** dynamic patches */
    transpilePackages: ['@dynamic-labs/sdk-react-core'],
    webpack: config => {
      // eslint-disable-next-line no-restricted-syntax
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    }
  };
  
  export default nextConfig;
  