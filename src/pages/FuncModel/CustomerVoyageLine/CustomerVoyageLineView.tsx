import ButtonOptionComponent from '@/pages/Common/Components/ButtonOptionComponent';
import getRequest from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Divider, Form, Input, Row } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import CustomerVoyageLineFormProps from './CustomerVoyageLineFormInterface';
class CustomerVoyageLineView extends React.Component<CustomerVoyageLineFormProps, CustomerVoyageLineFormProps> {
  constructor(props: CustomerVoyageLineFormProps) {
    super(props);
  }

  //钩子函数
  componentDidMount() {
    this.getCustorVoyageList();
  }

  getCustorVoyageList() {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let data: any = {};
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    params.set('pageSize', '-1');
    params.set('currentPage', '-1');
    params.set('date', moment());
    getRequest('/business/voyageLine', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.voyageLines, (voyageLine, index) => {
            if (Number(voyageLine.guid) === Number(guid)) {
              data = voyageLine;
              return;
            }
          });
        }
        this.setState({
          voyageLineName: data.voyageLineName,
          voyageLineNumber: data.voyageLineNumber,
          voyageIntention: getTableEnumText('voyage_intention', data.voyageIntention),
          currentPort: getTableEnumText('port', data.currentPort),
          portIntention: getTableEnumText('port', data.portIntention),
          locationIntention: getTableEnumText('voyage_area', data.locationIntention),
          items: data.items
        })
      }
    });
  }

  onBack = () => {
    this.props.history.push('/customervoyageLine/list');
  };


  //渲染页面组件
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    let voyageLineList =
      isNil(this.state) || isNil(this.state.items) ? [] : this.state.items;
    const elements: JSX.Element[] = [];
    forEach(voyageLineList, (item: any) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item {...formlayout} label='国家'>
              <Input disabled value={item.countryName} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item {...formlayout} label='港口名称'>
              <Input disabled value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item {...formlayout} label='类型'>
              <Input disabled value={item.portTypeName} />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看航线" event={() => { this.props.history.push('/customervoyageLine/list') }} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                {/* 下拉栏 */}
                <Form.Item {...formlayout} label="航线名称:">
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.voyageLineName) ? '' : this.state.voyageLineName
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="航线编号:">
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.voyageLineNumber) ? '' : this.state.voyageLineNumber
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />
        <LabelTitleComponent text="配置港口" event={() => { }} displayNone={true} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            {elements}
          </Form>
        </div>
        <div style={{ height: '60px' }} />
        <LabelTitleComponent text="其他信息" event={() => { }} displayNone={true} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='航次意向'>
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.voyageIntention) ? '' : this.state.voyageIntention
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='船舶当前位置'>
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.currentPort) ? '' : this.state.currentPort
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='意向港口'>
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.portIntention) ? '' : this.state.portIntention
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='意向区域'>
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.locationIntention) ? '' : this.state.locationIntention
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ height: '60px' }}>
          <Row type="flex" justify="center">
            <ButtonOptionComponent
              disabled={false}
              type="CloseButton"
              text='关闭'
              event={() => this.onBack()}
            />
          </Row>
        </div>
      </div>
    );
  }
}

const CustomerVoyageLineView_Form = Form.create({ name: 'CustomerVoyageLineView_Form' })(CustomerVoyageLineView);

export default CustomerVoyageLineView_Form;
