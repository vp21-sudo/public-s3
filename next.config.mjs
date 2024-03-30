/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: process.env.CONFIG_HOSTNAME
            }
        ]
    }
};

export default nextConfig;
