import { getRequest } from '@/utils/request';
import { Col, Form, Input, Row,Divider } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { RouteComponentProps } from 'dva/router';
import moment from 'moment';

class DictTypeView extends React.Component<RouteComponentProps> {
  state = {
    name: '',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: '',
  };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    getRequest('/sys/dictType/' + uid, params, (response: any) => {
      if (response.status == 200) {
        if (!isNil(response.data)) {
          this.setState({
            name: response.data.dictType.name,
            createUser: response.data.dictType.createUser,
            createDate: response.data.dictType.createDate,
            updateUser: response.data.dictType.updateUser,
            updateDate: response.data.dictType.updateDate,
          });
        }
      }
    });
  }

  //返回预览页
  onBack = () => {
    this.props.history.push('/dicttype');
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看字典类型" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
        <Form labelAlign="left">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formlayout} label="字典类型名称" >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.name)
                      ? ''
                      : this.state.name
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label="创建人" >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.createUser)
                      ? ''
                      : this.state.createUser
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formlayout} label="创建时间" >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.createDate)
                      ? ''
                      : moment(Number(this.state.createDate)).format('YYYY/MM/DD')
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label="修改人" >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.updateUser)
                      ? ''
                      : this.state.updateUser
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formlayout} label="修改时间" >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.updateDate)
                      ? ''
                      : moment(Number(this.state.updateDate)).format('YYYY/MM/DD')
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider dashed />
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent disabled={false}
                type="CloseButton"
                text="关闭"
                event={() => {
                  this.onBack();
                }}
              />
            </Col>
            <Col span={12}/>
          </Row>
        </Form>
        </div>
      </div>
    );
  }
}

const DictTypeView_Form = Form.create({ name: 'DictTypeView_Form' })(DictTypeView);

export default DictTypeView_Form;
