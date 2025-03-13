/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'], // Add your image domains here
  },
  // We can add more configuration as needed
  
  // Add minimal webpack configuration for browser compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Avoid bundling certain packages in the client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'child_process': false,
        'fs': false,
        'net': false,
        'tls': false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig; 