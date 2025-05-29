/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  webpack: (
    config: {
      experiments: any;
      externals: { [x: string]: string };
      resolve: { fallback: any };
      plugins: any[];
    },
    { webpack }: any
  ) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals["node:fs"] = "commonjs node:fs";
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, "");
        }
      )
    );

    return config;
  },
};

export default nextConfig;
