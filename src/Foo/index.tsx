import React, { type FC } from 'react';

const Foo: FC<{
  /**
   * @description 属性描述
   * @default "默认值"
   */
  title: string;
}> = (props) => <h4>{props.title}</h4>;

export default Foo;
