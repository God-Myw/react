import getRequest from '@/utils/request';
import { Col, Form, Input, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { formatMessage } from 'umi-plugin-locale';

class ParttradeView extends React.Component<RouteComponentProps> {
  state = {
    tradeType: '',
    partName: '',
    partModel: '',
    partCount: '',
    drawingNumber: '',
    partNumber: '',
  };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, string> = new Map();
    getRequest('/business/parttrade/' + uid, params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            tradeType: response.data.parttrade.tradeType,
            partName: response.data.parttrade.partName,
            partModel: response.data.parttrade.partModel,
            partCount: response.data.parttrade.partCount,
            drawingNumber: response.data.parttrade.drawingNumber,
            partNumber: response.data.parttrade.partNumber,
          });
        }
      }
    });
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Parttrade-ParttradeView.partExmaine' })}
          event={() => {
            this.props.history.push('/parttrade');
          }}
        />
        <Form>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeView.tradeType' })}>
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.tradeType) ? '' : this.state.tradeType
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeList.partName' })}>
                <Input
                  disabled
                  value={isNil(this.state) || isNil(this.state.partName) ? '' : this.state.partName}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeList.partModel' })}>
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.partModel) ? '' : this.state.partModel
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeList.partCount' })}>
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.partCount) ? '' : this.state.partCount
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeView.goodDrawingNumber' })}>
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.drawingNumber)
                      ? ''
                      : this.state.drawingNumber
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formlayout} label={formatMessage({ id: 'Parttrade-ParttradeList.partNumber' })}>
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.partNumber) ? '' : this.state.partNumber
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className={commonCss.rowTop}>
            <Col span={12} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                type="CloseButton"
                text={formatMessage({ id: 'Parttrade-ParttradeView.shutDown' })}
                event={() => {
                  this.props.history.push('/parttrade');
                }}
              />
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const ParttradeView_Form = Form.create({ name: 'ParttradeView_Form' })(ParttradeView);

export default ParttradeView_Form;
