/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/contact/:id.vcf',
        destination: '/api/vcard/:id',
      },
    ]
  },
}

export default nextConfig
