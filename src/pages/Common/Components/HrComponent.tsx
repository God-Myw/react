import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';

interface IHrComponent {
  text: string;
}

interface IHrInterface {
  text: string;
}

class HrComponent extends React.Component<IHrComponent, IHrInterface> {
  constructor(prop: IHrComponent) {
    super(prop);
  }
  render() {
    const { text } = this.props;
    let returnResult;
    if (text == 'solid') {
      returnResult = <hr className={commonCss.hrSolid} />;
    } else if (text == 'dashed') {
      returnResult = <hr className={commonCss.hrDashed} />;
    }
    return returnResult;
  }
}
export default HrComponent;
