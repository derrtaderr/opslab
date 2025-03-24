/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Miro iframe embedding
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://miro.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig; 