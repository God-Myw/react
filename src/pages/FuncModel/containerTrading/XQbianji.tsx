import { fileType } from '@/pages/Common/Components/FileTypeCons';
import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, Icon, message } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps, { FileModel, PicList } from './XQFACCE';
import { HandleBeforeUpload } from '@/utils/validator';
const defaultpic = require('../../Image/default.png');

const { TextArea } = Input;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);
  }

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();

    getRequest('/business/shipBooking/getContainerTradingDetailForWeb'+'?guid='+uid+'&',params,(response: any) => {

      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            portName : response.data.portName,
            remark : response.data.remark,
            detail : response.data.detail,
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerTrading/edit')
  }



  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='查看集装箱买卖'//查看货盘
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='交箱地点'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.portName) ? '' : this.state.portName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>

              </Col>
            </Row>
                  <Row gutter={24}>
                    <Col span={3}>

                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        集装箱尺寸
                      </h4>
                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        全新/二手
                      </h4>
                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        价格
                      </h4>
                    </Col>

                  </Row>

                  { isNil(this.state) || isNil(this.state.detail) ? '' :this.state.detail.map(item=>{
                      return (
                        <div>
                          <Row gutter={24}>
                            <Col span={3}>

                            </Col>
                            <Col span={4}>
                              <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.size}
                                />
                            </Col>
                            <Col span={4}>
                                <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.type==0?'全新':'二手'}
                                />
                            </Col>
                            <Col span={4}>
                                <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.money}
                                />
                            </Col>

                          </Row>
                          <br></br>
                        </div>
                      )})
                    }
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>集装箱购买说明</span>
                  </div>
                  <Row gutter={24}>
                    <Col>
                      <Form.Item {...smallFormItemLayout} label="班轮优势信息">
                        <Input.TextArea
                          maxLength={300}
                          style={{ width: '100%', height: '200px' }}
                          disabled
                          value={
                                  isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                                }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
              <Form labelAlign="left">
                <Row className={commonCss.rowTop}>
                    <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                      <ButtonOptionComponent
                        type="TurnDown"
                        text="关闭"
                        event={() => this.onBack()}
                        disabled={false}
                      />
                    </Col>
                </Row>

              </Form>

          </Form>
        </div>
      </div>
    );
  }
}

const PalletDynamicsView_Form = Form.create({ name: 'PalletDynamicsView_Form' })(
  PalletDynamicsView,
);

export default PalletDynamicsView_Form;
