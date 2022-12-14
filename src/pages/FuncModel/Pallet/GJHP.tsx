import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkNumber, checkRate, HandleBeforeUpload } from '@/utils/validator';
import { Col, DatePicker, Form, Icon, Input, message, Modal, Row, Select, Upload, Checkbox } from 'antd';
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
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
moment.locale(getLocale());
const FORMAT = 'YYYY/MM/DD';

type PalletProps = PalletFormProps & RouteComponentProps;
class PalletAdd extends React.Component<PalletFormProps, PalletProps> {

  constructor(props) {
    super(props)
    this.state={
      lalala:0,
      beizhu:'',
      unionTransport:0,
      isBind :0,
      insuranceJiangyun : 0,
      insuranceKache : 0,
      isGangji:0,
      lalala_1:0,
      // CG:this.props.values.InternationalTransport
    }
  }

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
      beizhu:'',
      beizhu_1:'',
      lalala_1:0,
      // visible: false,
    });

  }

  //删除图片
  onRemove = () => {
    this.setState(() => ({
      fileList: [],
    }));
  };

  //提交事件
  handleSubmit(type: number, flag: string) {
    this.props.form.validateFields((err: any, values: any) => {
      console.log(values);

      if (!err) {
        //保存或保存提交的时候向后台传入state
        let state;
        if (type === 1) {
          state = 0;
        } else if (type === 2) {
          state = 1;
        }
        let remark = this.state.beizhu;
        let remarkTwo = this.state.beizhu_1;
        let destinationPort = this.props.values.destinationPort;
        let goodsLevel = this.props.values.goodsLevel;
        let goodsMaxWeight = this.props.values.goodsMaxWeight;
        let goodsWeight = this.props.values.goodsWeight;
        let startPort = this.props.values.startPort;
        let unionTransport = this.state.unionTransport;
        let isBind = this.state.isBind;
        let insuranceJiangyun = this.state.insuranceJiangyun;
        let insuranceKache = this.state.insuranceKache;
        let isGangji = this.state.isGangji;
        let requestData = {};
        if (flag === '2') {
          requestData = {
            type: '2',
            state: state,
            remark:remark,
            remarkTwo:remarkTwo,
            startPort: startPort,//起运港
            destinationPort: destinationPort,//目的港
            goodsLevel: goodsLevel,//货品名称
            goodsMaxWeight: goodsMaxWeight,//重量
            goodsWeight: goodsWeight,//最大重量
            loadDate: moment(values.loadDate).valueOf(),//收载时间
            endDate: moment(moment(values.endDate).format(FORMAT)).valueOf(),//截止时间
            goodsVolume: values.goodsVolume,//体积
            location: values.location,//货物存放位置
            goodsProperty: values.goodsProperty,//货物性质
            isSuperposition: values.isSuperposition,//叠加
            majorParts: values.majorParts,//是否为重大件
            contacter: values.contacter,//联系人
            contactPhone: values.contactPhone,//联系方式
            phoneCode: values.phoneCode,//号段选择
            isGangji:isGangji,//港集
            unionTransport:unionTransport,//联合运输
            isBind:isBind,//绑扎
            insuranceJiangyun:insuranceJiangyun,//江运海运险
            insuranceKache:insuranceKache,//卡车运输险
            palletFileList: [
              {
                fileName: this.state.fileName,
                type: fileType.pallet_add,
                fileLog: 2,
              },
            ],
          };
          console.log(requestData);
          //新增保存提交请求
          postRequest('/business/pallet/postNewPallet', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              console.log(response)
              // this.props.history.push('/pallet');
              // window.location.replace('/pallet')
              // message.success(formatMessage({ id: 'pallet-palletAdd.addsuccess' }));
              window.location.replace('/pallet')
              message.success(formatMessage({ id: 'pallet-palletAdd.addsuccess' }));//新增成功
            }
          });
        } else if (flag === '1') {
          requestData = {
            type: '2',
            state: state,

            isGangji:isGangji,

            unionTransport:unionTransport,

            isBind:isBind,

            insuranceJiangyun:insuranceJiangyun,

            insuranceKache:insuranceKache,

            remark:remark,

            remarkTwo:remarkTwo,

            destinationPort: destinationPort,

            goodsLevel: goodsLevel,

            goodsMaxWeight: goodsMaxWeight,

            goodsWeight: goodsWeight,

            startPort: startPort,

            loadDate: moment(values.loadDate).valueOf(),//收载时间
            endDate: moment(moment(values.endDate).format(FORMAT)).valueOf(),//截止时间
            goodsVolume: values.goodsVolume,//体积
            isSuperposition: values.isSuperposition,//叠加
            contacter: values.contacter,//联系人
            contactPhone: values.contactPhone,//联系方式
            goodsProperty: values.goodsProperty,//货物性质
            location: values.location,//货物存放位置
            majorParts: values.majorParts,//是否为重大件
            phoneCode: values.phoneCode,//号段选择

            palletFileList: [
              {
                fileName: this.state.fileName,
                type: fileType.pallet_add,
                fileLog: 2,
              },
            ],
          };
          //新增保存请求
          postRequest('/business/pallet/postNewPallet', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              // this.props.history.push('/pallet');
              window.location.replace('/pallet')
              message.success('保存成功');
              console.log(response)

            }
          });
        }
      }
    });
  }

  //备注函数
  beizhu = (e) => {
    console.log(e)
    let zishu = e.length
    this.setState({
      beizhu : e,
      lalala : zishu,
    });
    // console.log(this.setState.lalala)

  };

  beizhu_1 = (e) => {
    console.log(e)
    let zishu = e.length
    this.setState({
      beizhu_1 : e,
      lalala_1 : zishu,
    });
    // console.log(this.setState.lalala)

  };

  //保险多选
  onChange=(checkedValues)=> {
    console.log('checked = ', checkedValues);
    let arr = checkedValues;
    // console.log(this)
    let A = arr.includes('A');
    let B = arr.includes('B');
    let C = arr.includes('C');
    let D = arr.includes('D');
    let E = arr.includes('E');
    console.log(A,B,C,D,E);
    if(A === true ){
      this.setState({unionTransport:1})
    }else{
      this.setState({unionTransport:0})
    };
    if(B === true ){
      this.setState({isBind:1})
    }else{
      this.setState({isBind:0})
    };
    if(C=== true){
      this.setState({insuranceJiangyun:1})
    }else{
      this.setState({insuranceJiangyun:0})
    };
    if(D===true){
      this.setState({insuranceKache:1})
    }else{
      this.setState({insuranceKache:0})
    };
    if(E === true ){
      this.setState({isGangji:1})
    }else{
      this.setState({isGangji:0})
    };
  };

  handleOk = () => {
  this.props.close({
    data: this.state.xuanze,
    type: 'ok'
  });
};

handleCancel = () => {
  this.props.close({
    type: 'cancel'
  });
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

  // 图片预览
  handlePreview = async (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', this.state.fileName);
    getRequest('/sys/file/getImageBase64/' + fileType.pallet_add, params, (response: any) => {
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };

  // 检查图片是否上传
  checkFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.fileList) || this.state.fileList.length === 0) {
      callback(formatMessage({ id: 'pallet-palletAdd.upload.picture.null' }));
    } else {
      callback();
    }
  };

  //取消预览
  handleC = () => {
    this.setState({ previewVisible: false });
  };

  //上传图片变更
  handleChange = ({ fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      forEach(fileList, file => {
        if (file.status === 'done') {
          this.setState({
            type: file.response.data.type,
            fileName: file.response.data.fileName,
            picflag: false,
          });
        } else if (file.status === 'uploading') {
          this.setState({ picflag: true });
        }
        this.setState({ fileList });
      });
    }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="pallet-palletAdd.upload.picture" />
        </div>
      </div>
    );
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || isNil(this.state.phoneCode) ? '+86' : this.state.phoneCode,
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );

    return (
      <Modal
        title="国际货运"
        width="90%"
        visible = {this.props.visible}
        // visible = {true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >

      <div className={commonCss.container}>
        <div className={commonCss.AddForm}>

          <Form labelAlign="left">
          <div className={commonCss.title}>
            <span className={commonCss.text}>运输时间</span>
          </div>
            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    {...formlayout}
                    label={formatMessage({ id: 'pallet-palletAdd.loading.time' })}
                  >
                    {getFieldDecorator(`loadDate`, {
                      initialValue:
                        isNil(this.state) || isNil(this.state.loadDate) || this.state.loadDate === ''
                          ? moment()
                          : moment(Number(this.state.loadDate)),
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'pallet-palletAdd.loading.time.null' }),
                        },
                        {
                          validator: this.checkTime.bind(this, 'loadDate')
                        }
                      ],
                    })(
                      <DatePicker
                        locale={getLocale()}
                        format={FORMAT}
                        style={{ width: '100%' }}
                        placeholder={formatMessage({ id: 'pallet-palletAdd.loading.time.enter' })}
                        onChange={this.handleLoadDateDatePick}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formlayout}
                    label={formatMessage({ id: 'pallet-palletAdd.deadline' })}
                  >
                    {getFieldDecorator(`endDate`, {
                      initialValue:
                        isNil(this.state) || isNil(this.state.endDate) || this.state.endDate === ''
                          ? moment()
                          : moment(Number(this.state.endDate)),
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'pallet-palletAdd.deadline.null' }),
                        },
                        {
                          validator: this.checkTime.bind(this, 'endDate')
                        }
                      ],
                    })(
                      <DatePicker
                        locale={getLocale()}
                        format={FORMAT}
                        style={{ width: '100%' }}
                        placeholder={formatMessage({ id: 'pallet-palletAdd.deadline.enter' })}
                        onChange={this.handleEndDatePick}
                      />,
                    )}
                  </Form.Item>
                </Col>
            </Row>
          <div className={commonCss.title}>
            <span className={commonCss.text}>货物信息</span>
          </div>
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.volume' })}//体积'
                >
                  {getFieldDecorator(`goodsVolume`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsVolume)
                        ? ''
                        : this.state.goodsVolume,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.volume.null' }),
                      },
                      {
                        validator: this.checkNumber.bind(this)
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.volume.enter' })}
                      suffix="m³"
                      onChange={e => this.setState({ goodsVolume: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.place' })}//货物存放位置
                >
                  {getFieldDecorator(`location`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.location)
                        ? undefined
                        : this.state.location,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.place.null' }),//货物存放位置不能为空
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.place.choose' })}//请选择货物存放位置
                    >
                      {getDictDetail('cargo_save_location').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.nature' })}//货物性质
                >
                  {getFieldDecorator(`goodsProperty`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsProperty)
                        ? undefined
                        : this.state.goodsProperty,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.nature.null' }),//货物性质不能为空!
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.nature.choose' })}//请选择货物性质
                      onChange={this.goodsPropertyChange}
                    >
                      {getDictDetail('goods_property').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.superposition-or-not' })}//是否可叠加
                >
                  {getFieldDecorator(`isSuperposition`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.isSuperposition)
                        ? undefined
                        : this.state.isSuperposition,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'pallet-palletAdd.superposition-or-not.null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'pallet-palletAdd.superposition-or-not.choose',
                      })}
                    >
                      {getDictDetail('is_superposition').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.whether.ItIs.heavyOrNot' })}//是否为重大件'
                >
                  {getFieldDecorator(`majorParts`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.majorParts)
                        ? undefined
                        : this.state.majorParts,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'pallet-palletAdd.whether.ItIs.heavyOrNot.null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'pallet-palletAdd.whether.ItIs.heavyOrNot.enter',
                      })}
                    >
                      <Select.Option value={0}>
                        {formatMessage({ id: 'pallet-palletAdd.ImportantpartsN' })}
                      </Select.Option>
                      <Select.Option value={1}>
                        {formatMessage({ id: 'pallet-palletAdd.ImportantpartsY' })}
                      </Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col  span={12}>
              {/* <Form.Item
                  {...formlayout}
                  label='佣金（还没改）'//是否为重大件'
                >
                  {getFieldDecorator(`majorParts`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.majorParts)
                        ? undefined
                        : this.state.majorParts,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'pallet-palletAdd.whether.ItIs.heavyOrNot.null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'pallet-palletAdd.whether.ItIs.heavyOrNot.enter',
                      })}
                    >
                      <Select.Option value={0}>
                        {formatMessage({ id: 'pallet-palletAdd.ImportantpartsN' })}
                      </Select.Option>
                      <Select.Option value={1}>
                        {formatMessage({ id: 'pallet-palletAdd.ImportantpartsY' })}
                      </Select.Option>
                    </Select>,
                  )}
                </Form.Item> */}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label='备注（选填）'
                >
                  <TextArea
                      rows={5}
                      maxLength="300"
                      placeholder="限制300字"
                      onChange={e=> this.beizhu(e.target.value)}
                  />
                  <span id="ziti">
                      {this.state.lalala}/300
                  </span>
                </Form.Item>
                </Col>
            </Row>

            <div className={commonCss.title}>
              <span className={commonCss.text}>联系信息</span>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.linkman' })}//联系人
                >
                  {getFieldDecorator(`contacter`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.linkman.null' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={20}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.linkman.enter' })}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.contact.way' })}//联系方式
                >
                  {getFieldDecorator(`contactPhone`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contactPhone)
                        ? ''
                        : this.state.contactPhone,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.contact.way.null' }),
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
              <Col span={12}></Col>
            </Row>

            <div className={commonCss.title}>
              <span className={commonCss.text}>添加货物清单</span>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  required
                  label={formatMessage({ id: 'pallet-palletAdd.add.goods.list' })}//添加货物清单
                ></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="">
                  {getFieldDecorator(`picture`, {
                    rules: [
                      {
                        validator: this.checkFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action={'/api/sys/file/upload/' + fileType.pallet_add}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.jpeg,.jpg,.tiff,.jfif"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.fileList) ||
                          this.state.fileList.length === 0
                          ? ''
                          : this.state.fileList
                      }
                      onRemove={this.onRemove}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.fileList) ||
                        this.state.fileList.length === 0
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label='备注（选填）'
                >
                  <TextArea
                      rows={5}
                      maxLength="300"
                      placeholder="限制300字"
                      onChange={e=> this.beizhu_1(e.target.value)}
                  />
                  <span id="ziti">
                      {this.state.lalala_1}/300
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>其他服务（选填）</span>
            </div>
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange.bind(this)}>
              <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label='是否需要其他联合运输'
                    >
                      <Checkbox value = 'A' > </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                <Form.Item
                      {...formlayout}
                      label='是否需要绑扎'
                    >
                      <Checkbox value = 'B' > </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                <Form.Item
                      {...formlayout}
                      label='是否需要集港'
                    >
                      <Checkbox value = 'E' > </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                <Form.Item
                      {...formlayout}
                      label='是否需要保险'
                    >
                      <Checkbox value = 'C' >江河海运险</Checkbox>
                      <br/>
                      <Checkbox value = 'D' >卡车运输险</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
            </Checkbox.Group>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="TurnDown"
                  text={formatMessage({ id: 'pallet-palletAdd.save' })}//保存
                  disabled={!isNil(this.state) && this.state.picflag}
                  event={() => {
                    this.handleSubmit(1, '1');
                  }}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({ id: 'pallet-palletAdd.save-and-submit' })}//保存并提交
                  disabled={!isNil(this.state) && this.state.picflag}
                  event={() => {
                    this.newMethod();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <Modal className="picModal"
          visible={
            isNil(this.state) || isNil(this.state.previewVisible)
              ? false
              : this.state.previewVisible
          }
          footer={null}
          onCancel={this.handleC}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
      </Modal>
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
        this.handleSubmit(2, '2');
      },
    });
  }
}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
