import * as React from 'react';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// TODO: 待解决
import { SwiperTouchAnimation } from 'oulae_dumi_component_mobile';
import 'swiper/css';
import './demo1.less';

export default () => {
  const $AnimationRef = useRef(null) as any;
  return (
    <div className="SwiperTouchAnimation-1">
      <div className="animation">
        <SwiperTouchAnimation
          ref={$AnimationRef}
          animationFra={31}
        ></SwiperTouchAnimation>
      </div>

      <Swiper
        spaceBetween={50}
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
        <SwiperSlide>
          <div className="slide">1</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">2</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">3</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">4</div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
