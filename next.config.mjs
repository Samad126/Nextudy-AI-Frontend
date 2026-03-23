/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.alias.canvas = false
        return config
    },
    turbopack: {
        resolveAlias: {
            canvas: "./empty-module.js",
        },
    },
}

export default nextConfig
