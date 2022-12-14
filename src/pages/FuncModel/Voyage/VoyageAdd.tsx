import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getTableEnumText, items, getDictDetail } from '@/utils/utils';
import { checkPhone } from '@/utils/validator';
import {
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import { getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import VoyageFormProps, { VoyagePort } from '../VoyageDynamics/VoyageDynamicsFormInterface';
moment.locale(getLocale());

const { confirm } = Modal;
const { Option } = Select;
const { Panel } = Collapse;
const dateFormat = 'YYYY/MM/DD';
let flag: string;
type prop = VoyagePort & VoyageFormProps;

//船东航次新增页面
class VoyageAdd extends React.Component<VoyageFormProps, prop> {
  constructor(props: VoyageFormProps) {
    super(props);
  }

  componentDidMount() {
    const shiplist: items[] = []; //船舶名称下拉
    const voyagelist: items[] = []; //航线下拉
    let guid: number = this.props.match.params['guid'] ? this.props.match.params['guid'] : null;
    this.setState({
      disabled: false,
      guid: guid,
    });
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    params.set('pageSize', '-1');
    params.set('currentPage', '-1');
    params.set('checkStatus', '1');
    //获取当前用户下船舶一览
    getRequest('/business/ship', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            shiplist.push({ code: ship.guid, textValue: ship.shipName });
          });
          this.setState({
            shipList: shiplist,
          });
        }
      }
    });

    //获取航线一览
    getRequest('/business/voyageLine', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.voyageLines, (voyageLine, index) => {
            voyagelist.push({ code: voyageLine.guid, textValue: voyageLine.voyageLineName });
          });
          this.setState({
            voyageList: voyagelist,
            voyageLines: response.data.voyageLines,
          });
        }
      }
    });

    if (!isNil(guid)) {
      this.setState(
        {
          disabled: true,
        },
        () => {
          //修改跳转操作
          flag = '2';
          let params: Map<string, string> = new Map();
          //通过ID获取投保信息
          getRequest('/business/voyage/' + guid, params, (response: any) => {
            if (response.status === 200) {
              //把查询到的信息data赋值给页面
              if (!isNil(response.data)) {
                let shipData = response.data.ship;
                let voyageData = response.data.voyage;
                let voyagePort = response.data.voyagePort;
                this.setState({
                  shipName: shipData.shipName,
                  shipType: getTableEnumText('ship_type', shipData.shipType),
                  shipDeck: getTableEnumText('ship_deck', shipData.shipDeck),
                  buildParticularYear: shipData.buildParticularYear,
                  tonNumber: shipData.tonNumber,
                  shipCrane: shipData.shipCrane,
                  draft: shipData.draft,
                  contacter: voyageData.contacter,
                  contactPhone: voyageData.contactPhone,
                  phoneCode: voyageData.phoneCode,
                  acceptTon: voyageData.acceptTon,
                  acceptCapacity: voyageData.acceptCapacity,
                  shipVoyage: voyageData.shipVoyage,
                  voyageStartPort: voyageData.voyageStartPort,
                  voyageLineName: response.data.voyageLineName,
                  voyagePortList: voyagePort,
                  port: voyageData.voyageStartPort,
                  vlId: voyageData.voyageLineId,
                });
              }
            }
          });
        },
      );
    } else {
      //新增操作
      //清空voyagePortList
      this.setState({ voyagePortList: [] });
      flag = '1';
    }
  }

  handleSubmit(type: number, guid: number, states: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        forEach(this.state.shipList, (item, index) => {
          if (values.shipName == item.textValue) {
            values.shipName = item.code;
            return;
          }
        });
        let param = {};
        if (!isNil(guid)) {
          param = {
            type: type, //保存-使用场景
            guid: guid,
            shipId: values.shipName, //船舶主键
            shipVoyage: this.state.shipVoyage, //航程
            acceptTon: this.state.acceptTon, //可接受吨位
            acceptCapacity: this.state.acceptCapacity, //可接受容积
            voyageStartPort: this.state.port, //预计停留港口
            voyageLineId: this.state.vlId, //航线主键
            contacter: this.state.contacter, //联系人
            phoneCode: values.phoneCode, //手机号段
            contactPhone: this.state.contactPhone, //联系电话
            state: states, //数据状态
            voyagePortVo: this.state.voyagePortList, //航次与对应港口voyagePortVo[]
          };
          //修改航次信息
          putRequest('/business/voyage/', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'Voyage-VoyageAdd.updateVoyageReleaseSuccess' }),
                2,
                this.onBack,
              );
            } else {
              message.error(
                formatMessage({ id: 'Voyage-VoyageAdd.updateVoyageReleaseFail' }),
                2,
                this.onBack,
              );
            }
          });
        } else {
          param = {
            type: type, //保存并提交-使用场景
            shipId: values.shipName, //船舶主键
            shipVoyage: Number(this.state.shipVoyage), //航程
            acceptTon: this.state.acceptTon, //可接受吨位
            acceptCapacity: Number(this.state.acceptCapacity), //可接受容积
            voyageStartPort: this.state.port, //预计停留港口
            voyageLineId: this.state.vlId, //航线主键
            contacter: this.state.contacter, //联系人
            phoneCode: values.phoneCode, //手机号段
            contactPhone: this.state.contactPhone, //联系电话
            state: states, //数据状态
            voyagePortVo: this.state.voyagePortList, //航次与对应港口voyagePortVo[]
          };
          //新增航次信息
          postRequest('/business/voyage', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'Voyage-VoyageAdd.addVoyageReleaseSuccess' }),
                2,
                this.onBack,
              );
            } else {
              message.error(
                formatMessage({ id: 'Voyage-VoyageAdd.addVoyageReleaseFail' }),
                2,
                this.onBack,
              );
            }
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/voyage/list');
  };

  //港口选择框
  selectPort = (id: any, option: any) => {
    this.setState({
      port: id,
    });
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

  //选择货船名称查询信息
  shipOnChange(value: any) {
    if (isNil(value) || value == '') {
      this.setState({
        shipDeck: '',
        shipType: '',
        buildParticularYear: undefined,
        tonNumber: '',
        shipCrane: '',
        draft: undefined,
        voyageStartPort: '',
        disabled: false,
      });
      return;
    }
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/ship/' + value, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState(
            {
              shipDeck: getTableEnumText('ship_deck', response.data.ship.shipDeck),
              shipType: getTableEnumText('ship_type', response.data.ship.shipType),
              buildParticularYear: response.data.ship.buildParticularYear,
              tonNumber: response.data.ship.tonNumber,
              shipCrane: response.data.ship.shipCrane,
              draft: response.data.ship.draft,
              voyageStartPort: response.data.ship.anchoredPort,
              port: response.data.ship.anchoredPort,
              disabled: true,
            },
            () => {
              if (!isNil(this.state) && !isNil(this.state.acceptTon)) {
                this.props.form.validateFields(['acceptTon']);
              }
            },
          );
        }
      }
    });
  }

  // 选择航线处理
  lineOnChange(_voyageLine: any): void {
    // 清空下拉值时初始化
    if (isNil(_voyageLine) || _voyageLine == '') {
      this.setState({
        voyagePortList: [],
      });
    } else {
      this.setState(
        {
          voyagePortList: [],
        },
        () => {
          //存放对应的港口信息
          let vlList: VoyagePort[] = [];
          forEach(this.state.voyageLines, (voyageLine, index) => {
            if (voyageLine.guid === _voyageLine) {
              forEach(voyageLine.items, (item, index) => {
                let vl: VoyagePort = {};
                vl.portTypeName = item.portTypeName;
                vl.viaId = item.portId;
                vl.portName = item.portName;
                vlList.push(vl);
              });
              this.setState({
                voyagePortList: vlList,
                vlId: _voyageLine,
              });
            }
          });
        },
      );
    }
  }

  handleDatePick = (index: any, isStart: boolean, value: any) => {
    const list = this.state.voyagePortList;
    if (isStart) {
      list[index].arriveDate = String(moment(moment(value).format(dateFormat)).valueOf());
    } else {
      list[index].leaveDate = String(moment(moment(value).format(dateFormat)).valueOf());
    }
    this.setState({
      voyagePortList: list,
    });
  };

  //吨位判断
  checkTon = (rule: any, val: any, callback: any) => {
    if (Number(val) <= Number(this.state.tonNumber)) {
      callback();
    } else {
      callback('可接受吨位需小于载重吨!');
    }
  };

  //判断ETA日期晚于前一个ETD日期
  checkETAtimePick = (index: number, rule: any, val: any, callback: any) => {
    let list = this.state.voyagePortList;
    let ETADate = moment(val).format('YYYY/MM/DD');
    if (index > 0 && !isNil(list[index - 1].leaveDate) && list[index - 1].leaveDate !== '') {
      let preETDDate = moment(Number(list[index - 1].leaveDate)).format('YYYY/MM/DD');
      if (moment(preETDDate) <= moment(ETADate)) {
        if (!isNil(list[index].leaveDate)) {
          let ETDDate = moment(Number(list[index].leaveDate)).format('YYYY/MM/DD');
          if (moment(ETDDate) >= moment(ETADate)) {
            callback();
          } else {
            callback('ETA时间必须早于ETD时间！');
          }
        } else {
          callback();
        }
      } else {
        callback('该港口ETA时间必须晚于前一个港口的ETD时间！');
      }
    } else {
      if (!isNil(list[index].leaveDate)) {
        let ETDDate = moment(Number(list[index].leaveDate)).format('YYYY/MM/DD');
        if (moment(ETADate) <= moment(ETDDate)) {
          callback();
        } else {
          callback('ETA时间必须早于ETD时间！');
        }
      } else {
        callback();
      }
    }
  };

  //判断ETD日期大于ETA日期
  checkETDtimePick = (index: number, rule: any, val: any, callback: any) => {
    let list = this.state.voyagePortList;
    let ETDDate = moment(val).format('YYYY/MM/DD');
    if (!isNil(list[index].arriveDate)) {
      let ETADate = moment(Number(list[index].arriveDate)).format('YYYY/MM/DD');
      if (moment(ETADate) <= moment(ETDDate)) {
        if (index < list.length - 1 && !isNil(list[index + 1].arriveDate) && list[index + 1].arriveDate !== '') {
          let nextETADate = moment(Number(list[index + 1].arriveDate)).format('YYYY/MM/DD');
          if (moment(nextETADate) < moment(ETDDate)) {
            callback('该港口ETD时间必须早于后一个港口的ETA时间！');
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback('ETD时间必须晚于ETA时间！');
      }
    } else {
      if (index < list.length - 1 && !isNil(list[index + 1].arriveDate) && list[index + 1].arriveDate !== '') {
        let nextETADate = moment(Number(list[index + 1].arriveDate)).format('YYYY/MM/DD');
        if (moment(nextETADate) < moment(ETDDate)) {
          callback('该港口ETD时间必须早于后一个港口的ETA时间！');
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
  };

  //渲染
  render() {
    //定义Ant Design 属性对象
    const { getFieldDecorator } = this.props.form;
    const alist = isNil(this.state) || isNil(this.state.shipList) ? [] : this.state.shipList;
    const blist = isNil(this.state) || isNil(this.state.voyageList) ? [] : this.state.voyageList;
    const clist =
      isNil(this.state) || isNil(this.state.voyagePortList) ? [] : this.state.voyagePortList;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || isNil(this.state.phoneCode) ? '+86' : this.state.phoneCode,
    })(
      <Select 
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{minWidth:'80px'}}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>
    );
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    //设置标头
    let headerFrame;
    if (flag === '1') {
      headerFrame = (
        <LabelTitleComponent
          text={formatMessage({ id: 'Voyage-VoyageAdd.voyageAdd' })}
          event={() => this.onBack()}
        />
      );
    } else if (flag === '2') {
      headerFrame = (
        <LabelTitleComponent
          text={formatMessage({ id: 'Voyage-VoyageAdd.voyageUpdate' })}
          event={() => this.onBack()}
        />
      );
    }

    //折叠板展开信息处理
    //获取港口list
    const elements: JSX.Element[] = [];
    forEach(clist, (item: VoyagePort, index) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8} style={{ marginLeft: '16px' }}>
            <Form.Item {...formlayout} label={item.portTypeName}>
              <Input
                disabled={isNil(item.portName) || item.portName === '' ? false : true}
                value={item.portName}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label="ETA">
              {getFieldDecorator(`ETA` + index, {
                initialValue: isNil(item.arriveDate) ? '' : moment(Number(item.arriveDate)),
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'Voyage-VoyageAdd.startTimeNotNull' }),
                  },
                  {
                    validator: this.checkETAtimePick.bind(this, index),
                  },
                ],
                validateFirst: true,
                validateTrigger: 'onSubmit',
              })(
                <DatePicker
                  locale={getLocale()}
                  format={dateFormat}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'Voyage-VoyageAdd.chooseStartTime' })}
                  onChange={this.handleDatePick.bind(this, index, true)}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label="ETD">
              {getFieldDecorator(`ETD` + index, {
                initialValue: isNil(item.leaveDate) ? '' : moment(Number(item.leaveDate)),
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'Voyage-VoyageAdd.arriveTimeNotNull' }),
                  },
                  {
                    validator: this.checkETDtimePick.bind(this, index),
                  },
                ],
                validateFirst: true,
                validateTrigger: 'onSubmit',
              })(
                <DatePicker
                  locale={getLocale()}
                  format={dateFormat}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'Voyage-VoyageAdd.chooseArriveTime' })}
                  onChange={this.handleDatePick.bind(this, index, false)}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    //渲染
    return (
      <div className={commonCss.container}>
        {headerFrame}
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.shipName' })}
                >
                  {getFieldDecorator('shipName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipName) ? undefined : this.state.shipName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseShipName' }),
                      },
                    ],
                  })(
                    <Select allowClear={true} onChange={this.shipOnChange.bind(this)} placeholder={formatMessage({ id: 'Voyage-VoyageList.shipName' })}>
                      {alist.map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipDeck' })}
                >
                  {getFieldDecorator('shipDeck', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipDeck) ? '' : this.state.shipDeck,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseShipDeck' }),
                      },
                    ],
                  })(
                    <Input
                      id="shipDeck"
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.shipDeck' })}
                      onChange={e => this.setState({ shipDeck: e.target.value })}
                      disabled={true}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.shipType' })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipType) ? '' : this.state.shipType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseShipType' }),
                      },
                    ],
                  })(
                    <Input
                      id="shipType"
                      placeholder={formatMessage({ id: 'Voyage-VoyageList.shipType' })}
                      onChange={e => this.setState({ shipType: e.target.value })}
                      disabled={true}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.buildYear' })}
                >
                  {getFieldDecorator('buildParticularYear', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : moment(this.state.buildParticularYear, 'YYYY'),
                    validateTrigger: 'buildParticularYear',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseBuildYear' }),
                      },
                    ],
                  })(<DatePicker format={'YYYY'} style={{ width: '100%' }} disabled={true} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.deadWeight' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.tonNumber) ? '' : this.state.tonNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseDeadWeight' }),
                      },
                    ],
                  })(
                    <Input
                      type="number"
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.deadWeight' })}
                      onChange={e => this.setState({ tonNumber: e.target.value })}
                      suffix={formatMessage({ id: 'Voyage-VoyageAdd.ton' })}
                      disabled={true}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipCrane' })}
                >
                  {getFieldDecorator('shipCrane', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipCrane) ? '' : this.state.shipCrane,
                  })(
                    <Input
                    placeholder={formatMessage({ id: 'Voyage-VoyageAdd.shipCrane' })}
                      onChange={e => this.setState({ shipCrane: e.target.value })}
                      disabled={true}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Voyage-VoyageAdd.draft' })}>
                  {getFieldDecorator('draft', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseDraft' }),
                      },
                    ],
                  })(
                    <Input
                      type="number"
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.draft' })}
                      onChange={e => this.setState({ draft: Number(e.target.value) })}
                      suffix={formatMessage({ id: 'Voyage-VoyageDelete.meter' })}
                      disabled={true}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipVoyage' })}
                >
                  {getFieldDecorator('shipVoyage', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipVoyage)
                        ? ''
                        : this.state.shipVoyage,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseShipVoyage' }),
                      },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.input ShipVoyage' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.shipVoyage' })}
                      suffix={formatMessage({ id: 'Voyage-VoyageView.seaMile' })}
                      onChange={e => this.setState({ shipVoyage: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.contacter' })}
                >
                  {getFieldDecorator('contacter', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseContacter' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.contacter' })}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.phoneNumber' })}
                >
                  {getFieldDecorator('contactPhone', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contactPhone)
                        ? ''
                        : this.state.contactPhone,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.inputPhoneNumber' }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                    ],
                  })(
                      <Input
                        maxLength={20}
                        addonBefore={prefixSelector}
                        placeholder={formatMessage({ id: 'pallet-palletAdd.contact.way' })}
                        style={{ width: '100%' }}
                        onChange={e => this.setState({ contactPhone: e.target.value })}
                        value={
                          isNil(this.state) || isNil(this.state.contactPhone)
                            ? ''
                            : this.state.contactPhone
                        }
                      />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.acceptVolume' })}
                >
                  {getFieldDecorator('acceptCapacity', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.acceptCapacity)
                        ? ''
                        : this.state.acceptCapacity,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseAcceptVolume' }),
                      },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.inputAcceptVolume' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.acceptVolume' })}
                      onChange={e => this.setState({ acceptCapacity: e.target.value })}
                      suffix="m³"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.acceptTon' })}
                >
                  {getFieldDecorator('acceptTon', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.acceptTon) ? '' : this.state.acceptTon,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseAcceptTon' }),
                      },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.rightnumeber' }),
                      },
                      {
                        validator: this.checkTon.bind(this),
                      },
                    ],
                    validateFirst: true,
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.acceptTon' })}
                      onChange={e => this.setState({ acceptTon: Number(e.target.value) })}
                      suffix={formatMessage({ id: 'Voyage-VoyageAdd.ton' })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.voyageStartPort' })}
                >
                  {getFieldDecorator('voyageStartPort', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.voyageStartPort)
                        ? undefined
                        : this.state.voyageStartPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'Voyage-VoyageAdd.chooseVoyageStartPort',
                        }),
                      },
                    ],
                  })(
                    <Select showSearch
                      optionFilterProp="children"
                      onSelect={this.selectPort}
                      placeholder={formatMessage({ id: 'Voyage-VoyageAdd.voyageStartPort' })}
                      filterOption={this.serach}
                    >
                      {getDictDetail("port").map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider dashed />
            {/*------------------------------------- 航线区 ----------------------------------------*/}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.settedVoyage' })}
                >
                  {getFieldDecorator('voyageLine', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.voyageLineName)
                        ? undefined
                        : this.state.voyageLineName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Voyage-VoyageAdd.chooseVoyageLine' }),
                      },
                    ],
                  })(
                    <Select allowClear={true} onChange={this.lineOnChange.bind(this)} placeholder={formatMessage({ id: 'Voyage-VoyageList.settedVoyage' })}>
                      {blist.map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Collapse
                bordered={false}
                style={{ paddingLeft: '0px' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="down-square"
                    theme="filled"
                    style={{
                      fontSize: '36px',
                      color: 'rgba(46,174,247,1)',
                      opacity: 1,
                      paddingTop: '0px',
                    }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel style={{ paddingLeft: '0px', border: '0' }} header="" key="1">
                  <div style={{ background: 'rgba(244,244,244,1)' }}>{elements}</div>
                </Panel>
              </Collapse>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="Save"
                  text={formatMessage({ id: 'Voyage-VoyageAdd.save' })}
                  event={() => this.handleSubmit(1, this.state.guid, 0)}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  disabled={false}
                  type="SaveAndCommit"
                  text={formatMessage({ id: 'Voyage-VoyageAdd.saveAndSubmit' })}
                  event={() => this.newMethod()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  private newMethod() {
    confirm({
      title: formatMessage({ id: 'Common-Publish.confirm.not' }),
      okText: formatMessage({
        id: 'Common-Publish.publish.confirm',
      }),
      cancelText: formatMessage({
        id: 'Common-Publish.publish.cancle',
      }),
      onOk: () => {
        // this.publishInsurance.bind(this);
        this.handleSubmit(2, this.state.guid, 1);
      },
    });
  }
}

const VoyageAdd_Form = Form.create({ name: 'VoyageAdd_Form' })(VoyageAdd);

export default VoyageAdd_Form;
