import { BodyMask } from 'oulae_dumi_component_mobile';
import * as React from 'react';
import styles from './demo1.module.less';
const { useState } = React;

const App: React.FC = () => {
  const [visible, setvisible] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setvisible(true);
        }}
      >
        clike me
      </button>

      <BodyMask
        visible={visible}
        style={{ color: 'blue' }}
        clickMaskCallback={() => {
          setvisible(false);
        }}
      >
        <div
          className={styles.container}
          onClick={() => {
            setvisible(false);
          }}
        >
          Hello world!
        </div>
      </BodyMask>
    </div>
  );
};

export default App;
