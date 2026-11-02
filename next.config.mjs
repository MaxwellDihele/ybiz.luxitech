const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_BASE_URL).hostname : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(mediaHost ? [{ protocol: "https", hostname: mediaHost }] : [])
    ]
  }
};
export default nextConfig;
