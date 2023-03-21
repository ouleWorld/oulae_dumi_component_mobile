import classNames from 'classnames';
import * as React from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Swiper as SwiperClass } from 'swiper/types';
import styles from './index.module.less';
import { caculateFra, dynamicStyle } from './utils';

export type SwiperTouchAnimationHandle = {
  /**
   * @description: Swiper onTouchStart 回调函数，主要用于组件的初始化
   * @return {*} void
   */
  touchStart: (e: SwiperClass) => void;
  /**
   * @description: Swiper onTouchMove 回调函数，用于控制 touchmove 期间的动画
   * @return {*}
   */
  touchMove: (e: SwiperClass) => void;
  /**
   * @description: Swiper onSlidePrevTransitionStart，onSlideNextTransitionStart，onSlideResetTransitionStart 回调函数，用于执行 transition 期间的回调函数
   * @return {*}
   */
  slideChangeTransitionStart: (e: SwiperClass) => void;
};

interface IAnimationProps {
  /**
   * @description 表示帧动画的总帧数
   */
  animationFra: number;
  /**
   * @description 表示帧动画的图像地址(暂时只支持图像按Y轴排列)
   */
  animationImgUrl: string;
}

const SwiperTouchAnimation = forwardRef<
  SwiperTouchAnimationHandle,
  IAnimationProps
>((props, ref) => {
  // setTimout key
  const $SettimeoutRef = useRef({
    end: 0,
  });
  const { animationFra, animationImgUrl } = props;
  const [animationData, setanimationData] = useState({
    touchMoveOutStatus: false, // 动画的状态，true 表示触发动画，false 表示不触发动画
    allDistance: 0, // 表示 swiper 滑动到末尾的总位移
    swiperPaginationNumber: 0, // 表示 swiper 翻页多少次之后到末尾
    animationTime: 300, // 表示 swiper 动画执行的时间，单位为 ms
    activeIndex: 0, // 当前 swiper 处于激活状态的 SwiperSlide 页面
    frames: 0, // 表示动画当前的帧数
  });

  /**
   * @description: 动画设置的回调函数
   * @param {number} fra 动画的帧数
   * @param {number} nextActiveIndex 下一个激活的 activeIndex
   * @return {*}
   */
  const animationCallback = (fra: number, nextActiveIndex: number) => {
    const { frames, animationTime } = animationData;

    const fraTemp = Math.abs(fra - frames);
    // 判断一下是否需要触发动画
    if (fraTemp) {
      // 动画内容
      // 如果需要做横版帧动画的兼容，则需要改动 background-position
      const str = `
        @keyframes steps_vertical_icon {
          0% {
            background-position: 0% ${Math.abs(frames / animationFra) * 100}%;
          }
          100% {
            background-position: 0% ${Math.abs(fra / animationFra) * 100}%;
          }
        }

        .animate_gamelist_icon {
          animation-name: steps_vertical_icon;
          animation-duration: ${animationTime}ms;
          animation-timing-function: steps(${Math.abs(fra - frames)}, end);
        }
      `;
      // 将动画内容插入到 css
      dynamicStyle.instance().update(str);

      // 将 touchMoveOutStatus 设置为 true，触发动画
      setTimeout(() => {
        setanimationData((data) => {
          return {
            ...data,
            touchMoveOutStatus: true,
          };
        });
      });

      // 动画执行完成之后，复原状态
      $SettimeoutRef.current.end = window.setTimeout(() => {
        setanimationData((data) => {
          return {
            ...data,
            touchMoveOutStatus: false,
            activeIndex: nextActiveIndex,
            frames: fra,
          };
        });

        setTimeout(() => {
          // 清除动画css内容
          dynamicStyle.instance().update('');
        });

        // 如果回调函数执行完，则是否 setTimeout Key
        $SettimeoutRef.current.end = 0;
      }, animationTime);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      touchStart: (e: any) => {
        // e.slidesSizesGrid: [353.266, 353.266, 353.266, 39.7344]
        // e.slidesSizesGrid 表示 swiper 每一页的宽度
        // temp: 表示 swiper 跳转到最后一页时所需要 translate 的位移数
        // e.slidesSizesGrid.length - 2： 表示 swiper 跳转到最后一页时所需要跳转的次数

        let allDistance = 0;
        let swiperPaginationNumber = 0;

        /**
         * 我们在使用 swiper 的时候，一般会有两种情况：
         * 1. slidesPerView=1, swiperSlide 占满当前容器
         * 2. slidesPerView='auto', swiperSlide 不占满当前容器
         *
         * 前提条件：
         * slidesSizesGridLength: 表示 swiperSlide 的数量
         * allDistance: 表示Swiper移动到最后一页的位移数量
         *
         * 情况 1：
         * slidesPerView=1, swiperSlide 占满当前容器：
         * 这种情况下，Swiper需要经过 slidesSizesGridLength - 1 次 slideChange 才能够到达末尾
         * 此时，allDistance = swiperSlide的宽度 * (slidesSizesGridLength - 1)
         *
         * 情况 2：
         * slidesPerView='auto', swiperSlide 不占满当前容器：
         * 这种情况下，Swiper需要经过 slidesSizesGridLength - 2 次 slideChange 才能够到达末尾(因为最后一页只是用来占满空间)
         * 此时，allDistance = swiperSlide的宽度 * (slidesSizesGridLength - 2)
         */
        const slidesSizesGridLength = e.slidesSizesGrid.length;
        if (
          // 我们使用第 1 页宽度和最后一页宽度是否相等来判断 swiper 的使用情况
          e.slidesSizesGrid[0] === e.slidesSizesGrid[slidesSizesGridLength - 1]
        ) {
          // 情况 1：slidesPerView=1, swiperSlide 占满当前容器
          allDistance = e.slidesSizesGrid[0] * (slidesSizesGridLength - 1);
          swiperPaginationNumber = slidesSizesGridLength - 1;
        } else {
          // 情况 2：slidesPerView='auto', swiperSlide 不占满当前容器
          allDistance = e.slidesSizesGrid[0] * (e.slidesSizesGrid.length - 2);
          swiperPaginationNumber = slidesSizesGridLength - 2;
        }

        const animationTime = e.passedParams?.speed || 300;
        if (allDistance !== animationData.allDistance) {
          setanimationData((data) => {
            return {
              ...data,
              allDistance,
              swiperPaginationNumber,
              animationTime,
            };
          });
        }
      },
      touchMove: (e: any) => {
        /**
         * touchMove 分为3种情况：
         * 1. swiper 最左边 向左移动
         * 2. swiper 最右边 向右移动
         * 3. swiper 中间时下一页
         * 4. swiper 中间上一页
         */
        const { translate } = e;
        const { allDistance } = animationData;
        // console.log('====> touchMove translate:', translate, allDistance);

        // 如果 $SettimeoutRef.current.end 存在 true 值，则表示当前还有动画还未执行完，需要将动画的内容清除
        if ($SettimeoutRef.current.end) {
          clearTimeout($SettimeoutRef.current.end);
          dynamicStyle.instance().update('');
        }

        // translate > 0: 最左边向左
        // Math.abs(translate) > allDistance: 最右边向右
        // 这两种状态下是不需要动画的
        if (translate > 0 || Math.abs(translate) > allDistance) {
          return;
        }

        let frames = animationData.frames;
        // 计算出当前出当前的帧数(这里一定要注意取整)
        frames = Math.abs(Math.ceil((translate / allDistance) * animationFra));

        setanimationData((data) => {
          return {
            ...data,
            // 由于可能存在动画可能，因此这里需要将动画的状态值变更为 false
            touchMoveOutStatus: false,
            frames: Math.abs(frames),
          };
        });
      },
      slideChangeTransitionStart: (e: any) => {
        const { activeIndex } = e;
        const fra = caculateFra(animationData, activeIndex, animationFra);
        animationCallback(fra, activeIndex);
      },
    };
  });

  useEffect(() => {
    dynamicStyle.instance().append();
  }, []);

  const { touchMoveOutStatus, frames } = animationData;
  return (
    <div className={styles.animationContainer}>
      <div className={styles.holder}></div>
      <div
        className={classNames(
          styles.animate,
          touchMoveOutStatus ? 'animate_gamelist_icon' : '',
        )}
        style={{
          backgroundPosition: `${0}% ${Math.abs(frames / animationFra) * 100}%`,
          backgroundImage: `url(${animationImgUrl})`,
        }}
      ></div>
    </div>
  );
});

export default SwiperTouchAnimation;
