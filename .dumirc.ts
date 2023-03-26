import { defineConfig } from 'dumi';

const repo = 'oulae_dumi_component_mobile';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'oulae_dumi_component_mobile',
  },
  apiParser: {},
  resolve: {
    entryFile: './src/index.ts',
  },
});
