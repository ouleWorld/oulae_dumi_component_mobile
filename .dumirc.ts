import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'oulae_dumi_component_mobile',
  },
  apiParser: {},
  resolve: {
    entryFile: './src/index.ts',
  },
});
