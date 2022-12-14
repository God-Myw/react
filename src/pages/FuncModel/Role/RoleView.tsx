import getRequest from '@/utils/request';
import { Col, Form, Input, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';

class PalletAdd extends React.Component<RouteComponentProps> {
  onBack = () => {
    this.props.history.push('/rolemanage');
  };
  state = {
    guid: '',
    roleName: '',
    creater: '',
    createDate: '',
    updater: '',
    updateDate: '',
  };
  convertTime=(time:string)=>{
    let arr= time.split('-');
    return arr[0]+'/'+arr[1]+'/'+arr[2].substr(0,2);
  };
  componentDidMount() {
    let id = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    getRequest('/sys/role/' + id, params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            guid: response.data.guid,
            roleName: response.data.roleName,
            creater: response.data.creater,
            createDate:this.convertTime(response.data.createDate),
            updater: response.data.updater,
            updateDate: this.convertTime(response.data.updateDate),
          });
        }
      }
    });
  }
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看角色信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="角色编号" >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.guid) ? '' : this.state.guid
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="角色名称">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.roleName) ? '' : this.state.roleName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="创建人" >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.creater) ? '' : this.state.creater
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="创建时间" >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.createDate) ? '' : this.state.createDate
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="修改人" >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.updater) ? '' : this.state.updater
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="修改时间">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.updateDate) ? '' : this.state.updateDate
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="CloseButton"
                  text="关闭"
                  event={() => {
                    this.onBack();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
