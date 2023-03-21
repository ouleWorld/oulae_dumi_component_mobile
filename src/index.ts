import Foo from './Foo';
import SwiperTouchAnimation from './SwiperTouchAnimation';

/**
 * [参考链接 - TypeScript Warning: Export, reexported as, was not found (possible exports)](https://github.com/typescript-cheatsheets/react#section-1-setup-typescript-with-react)
 * [参考链接 - Leveraging Type-Only imports and exports with TypeScript 3.8](https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb)
 *
 * Typescript 类型导出存在着两种方案：
 * 1. 使用 export *
 * 2. 使用 export type
 *
 * 通过使用 "import type "导入一个元素，它告诉编译器这个元素被导入只是为了作为一个类型注释/声明使用。由于这一点，编译器知道它可以在发出的代码中删除导入的内容。
 *
 * 感觉方案 1 更好一点，省事
 */
// 方案1：
export * from './SwiperTouchAnimation';
// 方案2：
// export type { SwiperTouchAnimationHandle } from './SwiperTouchAnimation';
/** ----------------------------------------------------- */
export { SwiperTouchAnimation };
export { Foo };
