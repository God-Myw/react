import { getRequest } from '@/utils/request';
import { Col, Form, Input, Row,Divider } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { RouteComponentProps } from 'dva/router';
const userType = localStorage.getItem('userType'); //得到当前用户类型

class DictTypeView extends React.Component<RouteComponentProps> {
  state = {
    titleEn: '', //字典英文值
    name: '', //字典类型名
    titleCn: '', //字典中文值
  };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let parentId = this.props.match.params['parentId'] ? this.props.match.params['parentId'] : '';
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    params.set('parentId', parentId);
    getRequest('/sys/dict/' + uid, params, (response: any) => {
      if (response.status== 200) {
        if (!isNil(response.data)) {
          this.setState({
            name: response.data.name,
            titleEn:response.data.titleEn,
            titleCn:response.data.titleCn
          });
        }
      }
    });
  }

  //返回预览页
  onBack = () => {
    this.props.history.push('/dictconfig');
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看字典配置" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
        <Form labelAlign="left">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formlayout} label="字典类型">
                <Input
                  disabled
                  value={isNil(this.state) || isNil(this.state.name) ? '' : this.state.name}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label="字典类型名称(英)">
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.titleEn) ? '' : this.state.titleEn
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formlayout} label="字典类型名称(中)">
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.titleCn) ? '' : this.state.titleCn
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider dashed />
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                disabled={false}
                type="CloseButton"
                text="关闭"
                event={() => {
                  this.onBack();
                }}
              />
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
        </div>
      </div>
    );
  }
}

const DictTypeView_Form = Form.create({ name: 'DictTypeView_Form' })(DictTypeView);

export default DictTypeView_Form;
