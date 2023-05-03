import * as React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
const { useEffect, useRef } = React;

export interface IBodyMaskProps {
  /** BodyMask 是否可见 */
  visible: boolean;
  /** BodyMask 显示的内容主体 */
  children: any;
  /** BodyMask children div style */
  style?: any;
  /** BodyMask mask color */
  maskBgColor?: string;
  /** BodyMask 点击 mask 的回调函数 */
  clickMaskCallback?: () => void;
}

const BodyMask = (props: IBodyMaskProps) => {
  const {
    visible,
    children,
    style = {},
    maskBgColor,
    clickMaskCallback,
  } = props;
  const $BodyDiv = useRef(document.createElement('div'));

  const styleObject = {
    ...style,
    backgroundColor: maskBgColor || 'rgba(0,0,0,.45)',
  };

  useEffect(() => {
    document.body.appendChild($BodyDiv.current);
  });

  return (
    visible &&
    ReactDOM.createPortal(
      <div className={styles.bodyMastRoot}>
        <div
          className={styles.mask}
          style={{ ...styleObject }}
          onClick={() => {
            console.log('点击了 mask');
            if (clickMaskCallback) {
              clickMaskCallback();
            }
          }}
        ></div>
        {children}
      </div>,
      $BodyDiv.current,
    )
  );
};

BodyMask.defaultProps = {
  style: {},
  maskBgColor: 'rgba(0, 0, 0, 0.45)',
};

export default BodyMask;
