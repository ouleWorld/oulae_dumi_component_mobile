import * as React from 'react';
import styles from './index.module.less';
// 这里忽略一下， noname-gesture 没有 ts 的版本
// @ts-ignore
import NonameGesture from './noname-gesture';
const { useRef } = React;

export interface ImageCheckProps {
  /** 表示显示图片的链接 */
  src: string;
}

type IImgKey =
  | 'imgWidth'
  | 'imgHeight'
  | 'maxScale'
  | 'minScale'
  | 'x'
  | 'y'
  | 'initialX'
  | 'initialY'
  | 'scale'
  | 'rotate'
  | 'width'
  | 'height';

const ImageCheck = (props: ImageCheckProps) => {
  const { src } = props;

  // console.log('__DEV__: ', __DEV__);

  const $Img = useRef<HTMLImageElement>(null);
  const $Log = useRef<HTMLDivElement>(null);
  const $imgInfo = useRef({
    width: 0, // 图片的原始宽度
    height: 0, // 图片的原始高度
    imgWidth: 0, // 计算出来的图片显示的宽度
    imgHeight: 0, // 计算出来的图片显示的高度
    maxScale: 1, // 最大放大倍数
    minScale: 0.5, // 最小放大倍数
    x: 0, // 图片横轴的偏移量
    y: 0, // 图片纵轴的偏移量
    initialX: 0, // 最开始图片 x 的偏移量(用于将图片归位)
    initialY: 0, // 最开始图片 y 的偏移量(用于将图片归位)
    scale: 1, // 图片的放大倍数
    rotate: 0, // 图片的旋转角度
  });

  // 设置 $imgInfo 信息
  const setImgInfo = (key: IImgKey, value: number) => {
    $imgInfo.current[key] = value;
  };

  // 获取 $imgInfo 信息
  // const getImgInfo = (key: IImgKey): number => {
  //   return $imgInfo.current[key];
  // };

  // 设置图片的 css 信息
  const setImgStyle = (transformTime: number | null) => {
    if ($Img.current) {
      const { x, y, scale, rotate } = $imgInfo.current;

      $Img.current.style.transition = transformTime
        ? `transform ${transformTime}ms`
        : 'none';
      $Img.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotate(${rotate}deg)`;
    }
  };

  const setLogHTML = (e?: any) => {
    if ($Log.current) {
      const { x, y, scale, rotate } = $imgInfo.current;
      if (e) {
        $Log.current.innerHTML = `x = ${x.toFixed(0)}<br>y = ${y.toFixed(
          0,
        )}<br>scale = ${scale.toFixed(5)}<br>rotate = ${rotate.toFixed(1)}<br>
        centerX = ${e._centerX.toFixed(0)}<br>centerY = ${e._centerY.toFixed(
          0,
        )}<br>
        lastCenterX = ${e._lastCenterX.toFixed(
          0,
        )}<br>lastCenterY = ${e._lastCenterY.toFixed(0)}`;
      } else {
        $Log.current.innerHTML = `x = ${x.toFixed(0)}<br>y = ${y.toFixed(
          0,
        )}<br>scale = ${scale.toFixed(5)}<br>rotate = ${rotate.toFixed(1)}`;
      }
    }
  };

  const imgOnloadCallback = () => {
    if ($Img.current) {
      const gesture = new NonameGesture($Img.current, {
        doubleTap: function (e: any) {
          const {
            scale,
            maxScale,
            imgWidth,
            imgHeight,
            initialX,
            initialY,
            x,
            y,
          } = $imgInfo.current;
          let ratio = 1 / scale;
          if (scale <= 1) {
            ratio = maxScale / scale;
          }
          const origin = {
            x: (ratio - 1) * imgWidth * 0.5,
            y: (ratio - 1) * imgHeight * 0.5,
          };
          // 由于图形回归会修改 x,y 的值，因此需要在这里单独重新获取 x, y，这样才能够保证图形正确回归
          if (scale <= 1) {
            setImgInfo('x', x - ((ratio - 1) * (e.clientX - x) - origin.x));
            setImgInfo('y', y - ((ratio - 1) * (e.clientY - y) - origin.y));
          } else {
            // 在缩小的情况下，需要将图形回归到原始图像
            setImgInfo('x', initialX);
            setImgInfo('y', initialY);
          }
          setImgInfo('scale', scale * ratio);

          setImgStyle(400);
          setLogHTML();
        },
        drag: function (e: any) {
          const { x, y } = $imgInfo.current;
          setImgInfo('x', x + e._diffX);
          setImgInfo('y', y + e._diffY);
          setImgStyle(null);
          setLogHTML();
        },
        rotate: function (e: any) {
          const { imgWidth, imgHeight, x, y, rotate } = $imgInfo.current;
          // transform-origin相对于视口左上角的坐标
          const origin = {
            x: imgWidth * 0.5 + x,
            y: imgHeight * 0.5 + y,
          };
          // 计算点图片变换中心绕双指中心旋转e._rotate度后的坐标，设为点a
          const a = {
            x:
              (origin.x - e._centerX) * Math.cos((e._rotate * Math.PI) / 180) -
              (origin.y - e._centerY) * Math.sin((e._rotate * Math.PI) / 180) +
              e._centerX,
            y:
              (origin.x - e._centerX) * Math.sin((e._rotate * Math.PI) / 180) +
              (origin.y - e._centerY) * Math.cos((e._rotate * Math.PI) / 180) +
              e._centerY,
          };
          // 计算偏移量
          setImgInfo('x', x - (origin.x - a.x));
          setImgInfo('y', y - (origin.y - a.y));
          // 旋转角度
          setImgInfo('rotate', (rotate + e._rotate + 360) % 360);

          setImgStyle(null);
          setLogHTML();
        },
        pinch: function (e: any) {
          const {
            scale,
            maxScale,
            minScale,
            imgWidth,
            imgHeight,
            x,
            y,
            // rotate,
          } = $imgInfo.current;
          // 缩放比例，计算宽高width *= e._scale; height *= e._scale;
          const _scale = scale * e._scale;
          if (_scale > maxScale) {
            e._scale = maxScale / scale;
            setImgInfo('scale', maxScale);
          } else if (_scale < minScale) {
            e._scale = minScale / scale;
            setImgInfo('scale', minScale);
          } else {
            setImgInfo('scale', _scale);
          }
          // 计算图片中心偏移量，默认transform-origin: 50% 50%
          // 如果transform-origin: 30% 40%，那origin.x = (e._scale - 1) * imgWidth * 0.3
          // origin.y = (e._scale - 1) * imgHeight * 0.4
          // 如果通过修改宽高或使用transform缩放，但将transform-origin设置为左上角时。
          // 可以不用计算origin，因为(e._scale - 1) * imgWidth * 0 = 0
          const origin = {
            x: (e._scale - 1) * imgWidth * 0.5,
            y: (e._scale - 1) * imgHeight * 0.5,
          };
          setImgInfo(
            'x',
            x -
              ((e._scale - 1) * (e._centerX - x) -
                origin.x -
                (e._centerX - e._lastCenterX)),
          );
          setImgInfo(
            'y',
            y -
              ((e._scale - 1) * (e._centerY - y) -
                origin.y -
                (e._centerY - e._lastCenterY)),
          );
          setImgStyle(null);
          setLogHTML(e);
        },
        wheel: function (e: any) {
          const {
            scale,
            maxScale,
            minScale,
            imgWidth,
            imgHeight,
            x,
            y,
            // rotate,
          } = $imgInfo.current;
          const _scale = scale * e._scale;
          if (_scale > maxScale) {
            e._scale = maxScale / scale;
            setImgInfo('scale', maxScale);
          } else if (_scale < minScale) {
            e._scale = minScale / scale;
            setImgInfo('scale', minScale);
          } else {
            setImgInfo('scale', _scale);
          }
          const origin = {
            x: (e._scale - 1) * imgWidth * 0.5,
            y: (e._scale - 1) * imgHeight * 0.5,
          };
          // 以鼠标位置为中心，计算缩放偏移量
          setImgInfo('x', x - ((e._scale - 1) * (e.clientX - x) - origin.x));
          setImgInfo('y', y - ((e._scale - 1) * (e.clientX - x) - origin.x));
          setImgStyle(null);
          setLogHTML();
          e.preventDefault();
        },
        pointerup: function () {
          const { x, y, scale, imgWidth, initialX, initialY } =
            $imgInfo.current;
          // 如果图片处于正常大小的话，那么此时回正图片
          if (scale === 1) {
            setImgInfo('x', initialX);
            setImgInfo('y', initialY);
            setImgStyle(400);
            setLogHTML();
            return;
          }
          let xTemp = x;
          let yTemp = y;
          const obj = ($Img.current as HTMLElement).getBoundingClientRect();
          if (obj.width >= window.innerWidth) {
            // 图片宽度 >= 屏幕宽度
            if (obj.right < window.innerWidth) {
              // 图片最右边存在黑边时
              xTemp += window.innerWidth - obj.right;
            } else if (obj.left > 0) {
              // 图片左边存在黑边的情况
              xTemp = (imgWidth * scale) / 2 - imgWidth / 2;
            }
          } else {
            // 图片的宽度 < 屏幕的宽度
            if (obj.right > window.innerWidth) {
              // 图片右边处于屏幕之外
              xTemp -= obj.right - window.innerWidth;
            } else if (obj.left < 0) {
              // 图片左边处于屏幕之外
              xTemp = (imgWidth * scale) / 2 - imgWidth / 2;
            }
          }

          if (obj.height >= window.innerHeight) {
            // 图片的高度 >= 屏幕的高度
            if (obj.top > 0) {
              // 图片的上部存在黑边
              yTemp -= obj.top;
            } else if (obj.bottom < window.innerHeight) {
              // 图片的下部存在黑边
              yTemp += window.innerHeight - obj.bottom;
            }
          } else {
            // 图片的高度 <= 屏幕的高度
            if (obj.top < 0) {
              // 图片上边位于屏幕之外
              yTemp += -1 * obj.top;
            } else if (obj.bottom > window.innerHeight) {
              // 图片的下边位于屏幕之外
              yTemp -= obj.bottom - window.innerHeight;
            }
          }

          setImgInfo('x', xTemp);
          setImgInfo('y', yTemp);
          setImgStyle(400);
          setLogHTML();
        },
      });
      setImgInfo('width', $Img.current.naturalWidth);
      setImgInfo('height', $Img.current.naturalHeight);
      // 图片初始信息
      const result = gesture.getImgSize(
        $Img.current.naturalWidth,
        $Img.current.naturalHeight,
        window.innerWidth,
        window.innerHeight,
      );
      setImgInfo('imgWidth', result.width);
      setImgInfo('imgHeight', result.height);

      const { imgWidth, imgHeight } = $imgInfo.current;
      setImgInfo('x', (window.innerWidth - imgWidth) * 0.5);
      setImgInfo('y', (window.innerHeight - imgHeight) * 0.5);
      setImgInfo('initialX', (window.innerWidth - imgWidth) * 0.5);
      setImgInfo('initialY', (window.innerHeight - imgHeight) * 0.5);
      setImgInfo(
        'maxScale',
        Math.max(Math.round($Img.current.naturalWidth / imgWidth), 3),
      );

      $Img.current.style.width = imgWidth + 'px';
      $Img.current.style.height = imgHeight + 'px';

      setImgStyle(null);
      setLogHTML();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <img ref={$Img} src={src} alt="ceshi" onLoad={imgOnloadCallback} />
      </div>
      <div ref={$Log} className={styles.log}></div>
    </>
  );
};

ImageCheck.defaultProps = {
  src: 'https://s.cn.bing.net/th?id=OHR.BuchsteinRossstein_ZH-CN4924477552_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&qlt=50',
};

export default ImageCheck;
