import getRequest from '@/utils/request';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table';
import { Col, Input, message, Modal, Row, Select, Form, Table } from 'antd';
import { forEach, isNil, values } from 'lodash';
import { CrewTrainingModel } from './CrewTrainingModel';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';

const InputGroup = Input.Group;
const { confirm } = Modal;
const { Option } = Select;

class CrewTrainingView extends React.Component<RouteComponentProps> {
  state = {
    columns: [],
  };

  componentDidMount() {
    this.setState({
      //列
    });
    this.initData();
  }
  initData() {}
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="查看船员培训信息"
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
      </div>
    );
  }
}

const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(
  CrewTrainingView,
);

export default MPCertificationList_Form;
