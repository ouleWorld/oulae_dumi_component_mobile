/**
 * @description: 根据 swiper 的下一页计算出对应的关键帧
 * @param {any} animationData
 * @param {number} nextActiveIndex 表示 swiper 的下一个
 * @param {number} animationFra 表示动画的总帧数
 * @return {}
 */
export const caculateFra = (
  animationData: any,
  nextActiveIndex: number,
  animationFra: number,
) => {
  const { swiperPaginationNumber } = animationData;
  const fra = Number(
    ((nextActiveIndex / swiperPaginationNumber) * animationFra).toFixed(0),
  );
  return fra;
};

// 动态操作 style 的 class，这里想要集中管理，所以这里写成了 class
export class dynamicStyle {
  id: string;
  static i: dynamicStyle;

  constructor() {
    this.id = 'animationCss';
  }

  // 单例模式的写法
  static instance(...rest: []) {
    this.i = this.i || new this(...rest);
    return this.i;
  }

  // 初始化 style 标签，将动态的 style 标签插入到页面中
  append() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '';
    style.id = this.id;
    document?.getElementsByTagName('HEAD')?.item(0)?.appendChild(style);
  }

  update(content: string) {
    const style = document.querySelector('#animationCss');
    if (style) {
      style.innerHTML = content;
    }
  }

  // destroy() {

  // }
}
