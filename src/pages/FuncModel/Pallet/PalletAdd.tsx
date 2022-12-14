//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
//          佛曰:
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import  { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkNumber, checkRate, HandleBeforeUpload } from '@/utils/validator';
import { Col, DatePicker, Form, Icon, Input, message, Modal, Row, Select, Upload, Button, } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps from './PalletFormInterface';
import PA from '../Pallet/PA';//国内货盘
import PB from '../Pallet/GJHP';//国际货盘

const { confirm } = Modal;
const { Option } = Select;
moment.locale(getLocale());
const FORMAT = 'YYYY/MM/DD';

type PalletProps = PalletFormProps & RouteComponentProps;
class PalletAdd extends React.Component<PalletFormProps, PalletProps> {
  constructor(prop: PalletFormProps) {
    super(prop);
  }

  state = {
    visible: false,
    requestData:{},
    visibleGG: false,
  };

  componentDidMount() {
    this.setState({
      history: this.props.history,
      previewVisible: false,
      fileList: [],
      title: formatMessage({ id: 'pallet-palletAdd.pallet.add' }),
      picflag: false,
      unloadingflag: false,
      loadDate: moment(),
      endDate: moment(),
      visible: false,
      visibleGG: false,
    });
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    if (uid !== '') {
      this.setState({
        //flag为2代表新增
        title: formatMessage({ id: 'pallet-palletAdd.pallet.alter' }),
        uid: uid,
      });
      let params: Map<string, string> = new Map();
      params.set('type', '1');
      +getRequest('/business/pallet/' + uid, params, (response: any) => {
        console.log(response)
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              goodsLevel: response.data.pallet.goodsLevel,
              goodsType: response.data.pallet.goodsType,
              goodsWeight: response.data.pallet.goodsWeight,
              goodsVolume: response.data.pallet.goodsVolume,
              goodsCount: response.data.pallet.goodsCount,
              isSuperposition: response.data.pallet.isSuperposition,
              startPort: response.data.pallet.startPort,
              destinationPort: response.data.pallet.destinationPort,
              loadDate: response.data.pallet.loadDate,
              endDate: response.data.pallet.endDate,
              contacter: response.data.pallet.contacter,
              contactPhone: response.data.pallet.contactPhone,
              loadingUnloadingVolume: response.data.pallet.loadingUnloadingVolume,
              unloadingDays: response.data.pallet.unloadingDays,
              location: response.data.pallet.location,
              goodsProperty: response.data.pallet.goodsProperty,
              majorParts: response.data.pallet.majorParts,
              phoneCode: response.data.pallet.phoneCode,
              fileName: response.data.palletFileList[0].fileName,
              //flag为1代表修改
              flag: '1',
              unloadingflag: response.data.pallet.goodsProperty === 3 ? true : false,
            });
            let picParams: Map<string, string> = new Map();
            picParams.set('fileNames', response.data.palletFileList[0].fileName);
            getRequest(
              '/sys/file/getThumbImageBase64/' + response.data.palletFileList[0].type, //BUG131改修fileType.pallet_add
              picParams,
              (response: any) => {
                if (response.status === 200) {
                  this.setState({
                    fileList: [
                      {
                        uid: '1',
                        name: response.data[0].fileName,
                        status: 'done',
                        thumbUrl: response.data[0].base64,
                      },
                    ],
                  });
                }
              },
            );
          }
        }
      });
    } else {
      this.setState({
        //flag为2代表新增
        flag: '2',
      });
    }
  }

  //删除图片
  onRemove = () => {
    this.setState(() => ({
      fileList: [],
    }));
  };

  //提交事件
  hanlujia(type: number){
    this.props.form.validateFields((err: any, values: any) => {
      console.log(err)
      console.log(values)
      if (!err) {
        //保存或保存提交的时候向后台传入state
        let state;
        if (type === 1) {
          state = 1;
        } else if (type === 2) {
          state = 1;
        }
        let requestData = {
          type : 1,

          goodsLevel: values.goodsLevel,

          goodsWeight: values.goodsWeight,

          goodsMaxWeight:values.goodsMaxWeight,

          startPort: values.startPort,

          destinationPort: values.destinationPort,

          state: state,
        };
        this.setState({requestData})
        console.log(requestData)
        //判断国内国外
        // this.showModal()
        postRequest('/business/pallet/postNewPallet', JSON.stringify(requestData), (response: any) => {
          console.log('1111')
          console.log('~~~~~~~~~~~')
          console.log(response.data.InternationalTransport)//这里报错了
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            if(response.data.InternationalTransport == 0){
                console.log('国内')
                this.showModal()
            }else{
                console.log('国外')
                this.showModal_GG()
                console.log(this.showModal_GG)
            };
          };
        });
      }


    })
  }



  //返回事件
  onBack = () => {
    this.props.history.push('/pallet');
  };
  //  受载日期选择
  handleLoadDateDatePick = (value: any) => {
    this.setState({
      loadDate: value,
    }, () => {
      if (!isNil(this.state.endDate)) {
        this.props.form.validateFields(['loadDate', 'endDate'])
      }
    });
  };

  // 截止日期选择
  handleEndDatePick = (value: any) => {
    this.setState({
      endDate: value,
    }, () => {
      if (!isNil(this.state.loadDate)) {
        this.props.form.validateFields(['loadDate', 'endDate'])
      }
    });
  };

  selectStartPortChange = (value: any) => {
    this.setState({
      startPort: value,
    });
  };

  selectDestinationPortChange = (value: any) => {
    this.setState({
      destinationPort: value,
    });
  };

  checkPort = (checkValue: string, rule: any, val: any, callback: any) => {
    if (checkValue !== '') {
      if (val === checkValue) {
        callback(formatMessage({ id: 'pallet-palletAdd.goods.checkport' }));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  goodsPropertyChange = (value: any) => {
    if (value === 3) {
      this.setState({
        goodsProperty: value,
        unloadingflag: true,
      })
    } else {
      this.setState({
        goodsProperty: value,
        unloadingflag: false,
      })
    }
  };

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //checkTime
  checkTime = (name: string, rule: any, val: any, callback: any) => {
    const date = moment(val).format('YYYY/MM/DD');
    if (name === 'loadDate' && !isNil(this.state.endDate)) {
      if (moment(date).isBefore(moment().format('YYYY/MM/DD'))) {
        callback(formatMessage({ id: 'pallet-palletAdd.check.loadDate.greater.current' }));
      } else if (moment(date).isAfter(moment(this.state.endDate).format('YYYY/MM/DD'))) {
        callback(formatMessage({ id: 'pallet-palletAdd.check.loadDate.less.endDate' }));
      } else {
        callback();
      }
    } else if (name === 'endDate' && !isNil(this.state.loadDate)) {
      if (moment(date).isBefore(moment(this.state.loadDate).format('YYYY/MM/DD'))) {
        callback(formatMessage({ id: 'pallet-palletAdd.check.loadDate.less.endDate' }));
      } else {
        callback();
      }
    }
  };

  //校验数字(最多保存三位小数)
  checkNumber = (rule: any, value: any, callback: any) => {
    if (value !== '' && !/^[0-9]+\.{0,1}[0-9]{0,3}$/.test(value)) {
      if(value.includes(".")){
        if(value.split(".")[1].length > 3){
          callback(formatMessage({ id: 'pallet-palletAdd.check.number', }))
        }else{
          callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
        }
      }else{
        callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
      }
    } else {
      callback();
    }
  };

  //国内下一步弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });

  };

  showModal_GG = () => {
    this.setState({
      visibleGG: true,
    });
    console.log(this.state.visibleGG);
  };

  userListFormClose(e) {
      console.log(e.type);
    // console.log(e.data.guid.guid)
      if(e.type === 'ok') {
        this.state.selectData = e.data;
      //   (e.data).forEach(item => {
      //     console.log(item.guid.guid)
      //     this.state.userList.push(item.guid.guid)
      //   })
      // }
      this.setState({
        visible: false,
        visibleGG: false,

      });
    }else{
      this.setState({
        visible: false,
        visibleGG: false,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? formatMessage({ id: 'pallet-palletAdd.pallet.add' })//新增货盘
              : this.state.title
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.port.shipment' })} //起运港
                >
                  {getFieldDecorator(`startPort`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.startPort)
                        ? undefined
                        : this.state.startPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.port.shipment.null' }), //起运港不能为空
                      },
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.destinationPort)
                            ? ''
                            : this.state.destinationPort,
                        ),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'pallet-palletAdd.port.shipment.choose' })}//请选择起运港
                      optionFilterProp="children"
                      onChange={this.selectStartPortChange}
                      filterOption={this.serach}
                    >
                      {getDictDetail('port').map((item: any) => (
                        // console.log(item)
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>

              </Col>
              <Col span={6}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.destination' })} //目的港
                >
                  {getFieldDecorator(`destinationPort`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.destinationPort)
                        ? undefined
                        : this.state.destinationPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.destination.null' }), //目的港不能为空
                      },
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.startPort)
                            ? ''
                            : this.state.startPort,
                        ),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'pallet-palletAdd.destination.choose' })} //'请选择目的港'
                      optionFilterProp="children"
                      onChange={this.selectDestinationPortChange}
                      filterOption={this.serach}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.pallet.name' })}//货物名称
                >
                  {getFieldDecorator(`goodsLevel`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsLevel)
                        ? undefined
                        : this.state.goodsLevel,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.pallet.name.null' }),//货物名称不能为空
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.pallet.name.choose' })}//请选择货物名称
                    >
                      {getDictDetail('goods_name').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>

              </Col>
              <Col span={6}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.weight' })}//货物重量
                >
                  {getFieldDecorator(`goodsWeight`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsWeight)
                        ? ''
                        : this.state.goodsWeight,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.weight.null' }),//货物重量不能为空
                      },
                      {
                        validator: this.checkNumber.bind(this)
                      },
                    ],
                  })
                  (
                    <Input
                      maxLength={6}
                      placeholder='请输入货物最小重量'//请输入货物重量
                      suffix='吨'//吨
                      onChange={e => this.setState({ goodsWeight: e.target.value })}
                    />,
                  )
                  }
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  {...formlayout}
                >
                  {getFieldDecorator(`goodsMaxWeight`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsMaxWeight)
                        ? ''
                        : this.state.goodsMaxWeight,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.weight.null' }),//货物重量不能为空
                      },
                      {
                        validator: this.checkNumber.bind(this)
                      },
                    ],
                  })(
                    <Input
                      maxLength={6}
                      placeholder='请输入货物最大重量'//请输入货物重量
                      suffix='吨'//吨
                      onChange={e => this.setState({ goodsMaxWeight: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>

              <Col span={12}  className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="TurnDown"
                  text='下一步'//保存
                  // disabled={!isNil(this.state) && this.state.picflag}

                  event={() => {
                    // this.handleSubmit(1, this.state.flag);
                    this.hanlujia(1)
                  }}
                />
                {/* <Button
                  type="primary"
                  onClick={() => {
                    this.hanlujia(1)
                  }}
                >
                  下一步
                </Button> */}
              </Col>
              <PA visible={this.state.visible} close={this.userListFormClose.bind(this)} values={this.state.requestData}/>

              <PB visible={this.state.visibleGG} close={this.userListFormClose.bind(this)} values={this.state.requestData}/>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
