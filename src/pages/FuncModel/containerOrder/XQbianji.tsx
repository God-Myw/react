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
const InputGroup = Input.Group;

const { TextArea } = Input;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);
  }

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    console.log(uid);
    let params: Map<string, string> = new Map();

    getRequest('/business/shipBooking/getContainerLeasingDeatilForWeb'+'?guid='+ uid, params,(response: any) => {

      console.log(111111111111)
      console.log(111111111111)
      console.log(111111111111)
      console.log(111111111111)
      console.log(response)
      if (response.status === 200) {
        console.log(response)
        if (!isNil(response.data)) {
          this.setState({
            country: response.data.country ? response.data.country : '', //还箱国家
            containerFourtyEight: response.data.containerFourtyEight ? response.data.containerFourtyEight : '', //48英尺

            containerFourtyEightTejia: response.data.containerFourtyEightTejia ? response.data.containerFourtyEightTejia : '', //48英尺特价

            containerFourtyEightYuanjia: response.data.containerFourtyEightYuanjia ? response.data.containerFourtyEightYuanjia : '', //48英尺原价

            containerFiftyThree: response.data.containerFiftyThree ? response.data.containerFiftyThree : '', //53英尺

            containerFiftyThreeTejia: response.data.containerFiftyThreeTejia ? response.data.containerFiftyThreeTejia : '', //53英尺特价

            containerFiftyThreeYuanjia: response.data.containerFiftyThreeYuanjia ? response.data.containerFiftyThreeYuanjia : '', //53英尺原价



          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerOrder/edit')
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
          text='查看集装箱租赁'//查看货盘
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
          <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item  {...formlayout} label="还箱国家">
                      <InputGroup >
                          <Col span={8}>
                            <Input disabled value={
                              isNil(this.state) || isNil(this.state.country) ? '' : this.state.country
                            } />
                          </Col>
                      </InputGroup>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                  </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="集装箱尺寸">
                    <InputGroup >
                        <Col span={8} style={{textAlign:'center'}}>
                        {/* 48英尺 */}
                          <p>48英尺👇</p>
                        </Col>
                        <Col span={8} style={{textAlign:'center'}}>
                        {/* 53 英尺 */}
                          <p>53英尺👇</p>
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="集装箱尺寸">
                    <InputGroup >
                        <Col span={8}>
                        <Input disabled value={
                              isNil(this.state) || isNil(this.state.containerFourtyEight) ? '' : this.state.containerFourtyEight
                            } />
                        </Col>
                        <Col span={8}>
                        <Input disabled value={
                              isNil(this.state) || isNil(this.state.containerFiftyThree) ? '' : this.state.containerFiftyThree
                            } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>


                <Col span={12}>
                  <Form.Item  {...formlayout} label="限时特价">
                    <InputGroup >

                        <Col span={8}>
                        <Input disabled value={
                              isNil(this.state) || isNil(this.state.containerFourtyEightTejia) ? '' : this.state.containerFourtyEightTejia
                            } />
                        </Col>
                        <Col span={8}>
                        <Input disabled value={
                              isNil(this.state) || isNil(this.state.containerFiftyThreeTejia) ? '' : this.state.containerFiftyThreeTejia
                            } />
                        </Col>

                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>
              </Row>


              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="原价">
                    <InputGroup >
                        <Col span={8}>
                          <Input disabled style={{textDecorationLine:'line-through'}} value={
                              isNil(this.state) || isNil(this.state.containerFourtyEightYuanjia) ? '' : this.state.containerFourtyEightYuanjia
                            } />
                        </Col>
                        <Col span={8}>
                          <Input disabled style={{textDecorationLine:'line-through'}}value={
                              isNil(this.state) || isNil(this.state.containerFiftyThreeYuanjia) ? '' : this.state.containerFiftyThreeYuanjia
                            }/>
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

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
