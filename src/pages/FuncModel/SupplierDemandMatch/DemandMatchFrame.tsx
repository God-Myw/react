import React from 'react';
import { RouteComponentProps } from 'dva/router';
import Form from 'antd/es/form';
import commonCss from '@/pages/Common/css/CommomCss.less';
import LabelTitleComponent from '@/pages/Common/Components/LabelTitleComponent';

class DemandMatchFrameForm extends React.Component<RouteComponentProps> {
  componentDidMount() {
    this.initData();
  }

  //获取航线记录矩阵
  initData() {
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    pageInfo: {
    }
  }
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="供需匹配" event={() => {}} />
      </div>
    );
  }
}
const DemandMatchFrame_Form = Form.create({ name: 'DemandMatch_Frame_Form' })(DemandMatchFrameForm);

export default DemandMatchFrame_Form;
