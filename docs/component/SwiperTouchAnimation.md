---
title: SwiperTouchAnimation
toc: content
order: 1
---

## SwiperTouchAnimation

swiper 联动动画组件

:::warning
当前组件只支持帧动画按 Y 轴排列，暂时没有做 X 轴帧动画的适配(如果需要适配，需要改一下动画配置)
:::

## 何时使用

当需要绘制一个动画，动画要求：

1. 用户滑动时(触发 touchmove)，动画能够随动运行
2. 用户放手时，动画能够运行到预期的位置，同时执行周期和 swiper 的运行周期一致(触发 touchend 之后)

我们在使用 swiper 的时候，一般会有两种情况：

1. slidesPerView=1, swiperSlide 占满当前容器
2. slidesPerView='auto', swiperSlide 不占满当前容器

## 使用方式

### 基本使用 - swiperSlide 占满当前容器时

<code src="./demo/SwiperTouchAnimation/demo1.tsx"></code>

### swiperSlide 不占满当前容器

<code src="./demo/SwiperTouchAnimation/demo2.tsx"></code>

### swiperSlide 数量较多情况

同样一张图谱，如果我们 swiperSlide 数量较多，那么使用起来会有很明显的迟滞感；如果使用场景的 swiperSlide 数量很多，推荐帧动画帧率适当提高

<code src="./demo/SwiperTouchAnimation/demo3.tsx"></code>

## API

### SwiperTouchAnimation

:::warning
API 内容是使用 dumi 自动 API 表格功能它存在如下问题：

1. ref 属性的类型不能被正确解析，正确地类型应该是 SwiperTouchAnimationHandle
2. 莫名其妙传入了一个 Key 值
   :::

<API id="SwiperTouchAnimation"></API>

### SwiperTouchAnimationHandle

| 属性名                     | 描述                                                       | 类型                     | 默认值 |
| -------------------------- | ---------------------------------------------------------- | ------------------------ | ------ |
| touchStart                 | Swiper onTouchStart 回调函数，主要用于组件的初始化         | (e: SwiperClass) => void | -      |
| touchMove                  | Swiper onTouchMove 回调函数，用于控制 touchmove 期间的动画 | (e: SwiperClass) => void | -      |
| slideChangeTransitionStart | Swiper transition 变化之后 回调函数                        | (e: SwiperClass) => void | -      |
