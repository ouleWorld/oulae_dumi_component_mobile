// TODO: 感觉这里的声明语句还是存在着优化空间的
import Foo from './Foo';
import SwiperTouchAnimation from './SwiperTouchAnimation';

// TODO: 理解一下这个到底是什么意思
// [参考链接](https://github.com/typescript-cheatsheets/react#section-1-setup-typescript-with-react)
export type { SwiperTouchAnimationHandle } from './SwiperTouchAnimation';
export { Foo };
export { SwiperTouchAnimation };
