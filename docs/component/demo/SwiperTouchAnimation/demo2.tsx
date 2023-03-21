import * as React from 'react';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { SwiperTouchAnimation } from 'oulae_dumi_component_mobile';
import 'swiper/css';
import './demo2.less';

export default () => {
  const $AnimationRef = useRef(null) as any;
  return (
    <div className="SwiperTouchAnimation-2">
      <div className="animation">
        <SwiperTouchAnimation
          ref={$AnimationRef}
          animationFra={31}
          animationImgUrl={
            'https://img.alicdn.com/imgextra/i2/O1CN01zpsELl1jRewOmKX3R_!!6000000004545-0-tps-252-8064.jpg'
          }
        ></SwiperTouchAnimation>
      </div>

      <Swiper
        // slidesPerView: 表示view 中 slide 的数量, 如果设置为 auto, 则表示 slide 处于 start 的位置
        // slidesPerView={'auto'}
        slidesPerView={'auto'}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        onTouchStart={(e: any) => {
          $AnimationRef.current.touchStart(e);
        }}
        onTouchMove={(e) => {
          $AnimationRef?.current?.touchMove(e);
        }}
        onSlidePrevTransitionStart={(e) => {
          // 触发了上一页的逻辑
          $AnimationRef?.current?.slideChangeTransitionStart(e);
        }}
        onSlideNextTransitionStart={(e) => {
          // 触发了下一页的逻辑
          $AnimationRef?.current?.slideChangeTransitionStart(e);
        }}
        onSlideResetTransitionStart={(e) => {
          // 触发了复原的逻辑
          $AnimationRef?.current?.slideChangeTransitionStart(e);
        }}
      >
        <SwiperSlide className="slide">
          <div>1</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <div>2</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <div>3</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <div>4</div>
        </SwiperSlide>
        <SwiperSlide className="lastSlide">
          <div>5</div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
