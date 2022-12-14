import React from 'react';
import { Icon } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import { isNil } from 'lodash';

interface ILabelTitleComponent {
  displayNone?: boolean;
  text: string;
  event: () => void;
}

interface ILabelTitleInterface {
  text: string;
  event: () => void;
}

class LabelTitleComponent extends React.Component<ILabelTitleComponent, ILabelTitleInterface> {
  constructor(prop: ILabelTitleComponent) {
    super(prop);
  }
  render() {
    const { text, event } = this.props;
    const isDisplay = !isNil(this.props.displayNone) && this.props.displayNone ? true : false;
    return (
      <div className={commonCss.title}>
        <span className={commonCss.text}>{text}</span>
        <Icon className={commonCss.icon} type="close-circle" style={{ display: isDisplay ? 'none' : 'block' }} onClick={event} />
      </div>
    );
  }
}
export default LabelTitleComponent;
