// 这个配置是为了解决ts 报错：找不到模块“./index.module.less”或其相应的类型声明
// [Can't import CSS/SCSS modules. TypeScript says "Cannot Find Module"](https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module)
declare module '*.less';
declare module 'oulae_dumi_component_mobile';
