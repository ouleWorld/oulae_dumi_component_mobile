import { ImageCheck } from 'oulae_dumi_component_mobile';
import * as React from 'react';
import './demo1.less';

export default function App() {
  // console.log('__VERSION__: ', __VERSION__);

  const src =
    'https://s.cn.bing.net/th?id=OHR.BuchsteinRossstein_ZH-CN4924477552_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&qlt=50';

  return (
    <div>
      <ImageCheck src={src} />
    </div>
  );
}
