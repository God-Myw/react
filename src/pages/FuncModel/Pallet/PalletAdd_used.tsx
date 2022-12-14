import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkNumber, checkRate, HandleBeforeUpload } from '@/utils/validator';
import { Col, DatePicker, Form, Icon, Input, message, Modal, Row, Select, Upload } from 'antd';
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
moment.locale(getLocale());
const FORMAT = 'YYYY/MM/DD';

type PalletProps = PalletFormProps & RouteComponentProps;
class PalletAdd extends React.Component<PalletFormProps, PalletProps> {
  constructor(prop: PalletFormProps) {
    super(prop);
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
  handleSubmit(type: number, flag: string) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        //保存或保存提交的时候向后台传入state
        let state;
        if (type === 1) {
          state = 0;
        } else if (type === 2) {
          state = 1;
        }

        let requestData = {};
        if (flag === '2') {
          requestData = {
            type: '1',
            goodsLevel: values.goodsLevel,
            goodsType: values.goodsType,
            goodsWeight: values.goodsWeight,
            goodsVolume: values.goodsVolume,
            goodsCount: values.goodsCount,
            isSuperposition: values.isSuperposition,
            startPort: values.startPort,
            destinationPort: values.destinationPort,
            loadDate: moment(values.loadDate).valueOf(),
            endDate: moment(moment(values.endDate).format(FORMAT)).valueOf(),
            contacter: values.contacter,
            contactPhone: values.contactPhone,
            loadingUnloadingVolume: isNil(values.loadingUnloadingVolume) ? '' : values.loadingUnloadingVolume,
            unloadingDays: isNil(values.unloadingDays) ? '' : values.unloadingDays,
            state: state,
            goodsProperty: values.goodsProperty,
            location: values.location,
            majorParts: values.majorParts,
            phoneCode: values.phoneCode,
            palletFileList: [
              {
                fileName: this.state.fileName,
                type: fileType.pallet_add,
                fileLog: 2,
              },
            ],
          };
          // 新增保存请求
          postRequest('/business/pallet', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/pallet');
              message.success(formatMessage({ id: 'pallet-palletAdd.addsuccess' }));
            }
          });
        } else if (flag === '1') {
          requestData = {
            type: '1',
            guid: this.state.uid,
            goodsLevel: values.goodsLevel,
            goodsType: values.goodsType,
            goodsWeight: values.goodsWeight,
            goodsVolume: values.goodsVolume,
            goodsCount: values.goodsCount,
            isSuperposition: values.isSuperposition,
            startPort: values.startPort,
            destinationPort: values.destinationPort,
            loadDate: moment(values.loadDate, FORMAT).valueOf(),
            endDate: moment(moment(values.endDate).format(FORMAT)).valueOf(),
            contacter: values.contacter,
            contactPhone: values.contactPhone,
            loadingUnloadingVolume: isNil(values.loadingUnloadingVolume) ? '' : values.loadingUnloadingVolume,
            unloadingDays: isNil(values.unloadingDays) ? '' : values.unloadingDays,
            state: state,
            goodsProperty: values.goodsProperty,
            location: values.location,
            majorParts: values.majorParts,
            phoneCode: values.phoneCode,
            palletFileList: [
              {
                fileName: this.state.fileName,
                type: fileType.pallet_add,
                fileLog: 2,
              },
            ],
          };
          // 修改保存请求
          putRequest('/business/pallet', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/pallet');
              message.success(formatMessage({ id: 'pallet-palletAdd.changesuccess' }));
            }
          });
        }
      }
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
  handleCancel = () => {
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
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? formatMessage({ id: 'pallet-palletAdd.pallet.add' })
              : this.state.title
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.pallet.name' })}
                >
                  {getFieldDecorator(`goodsLevel`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsLevel)
                        ? undefined
                        : this.state.goodsLevel,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.pallet.name.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.pallet.name.choose' })}
                    >
                      {getDictDetail('goods_name').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.pallet.type' })}
                >
                  {getFieldDecorator(`goodsType`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsType)
                        ? undefined
                        : this.state.goodsType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.pallet.type.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.pallet.type.choose' })}

                    >
                      {getDictDetail('goods_type').map((item: any) => (
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
                  label={formatMessage({ id: 'pallet-palletAdd.goods.place' })}
                >
                  {getFieldDecorator(`location`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.location)
                        ? undefined
                        : this.state.location,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.place.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.place.choose' })}
                    >
                      {getDictDetail('cargo_save_location').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.nature' })}
                >
                  {getFieldDecorator(`goodsProperty`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsProperty)
                        ? undefined
                        : this.state.goodsProperty,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.nature.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.nature.choose' })}
                      onChange={this.goodsPropertyChange}
                    >
                      {getDictDetail('goods_property').map((item: any) => (
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
                  label={formatMessage({ id: 'pallet-palletAdd.goods.weight' })}
                >
                  {getFieldDecorator(`goodsWeight`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsWeight)
                        ? ''
                        : this.state.goodsWeight,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.weight.null' }),
                      },
                      {
                        validator: this.checkNumber.bind(this)
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.weight.enter' })}
                      suffix={formatMessage({ id: 'pallet-palletAdd.goods.weight.t' })}
                      onChange={e => this.setState({ goodsWeight: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.volume' })}
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
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.goods.number' })}
                >
                  {getFieldDecorator(`goodsCount`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsCount)
                        ? ''
                        : this.state.goodsCount,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.goods.number.null' }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'user-login.login.pls-input-number' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={11}
                      placeholder={formatMessage({ id: 'pallet-palletAdd.goods.number.enter' })}
                      suffix={formatMessage({ id: 'pallet-palletAdd.number' })}
                      onChange={e => this.setState({ goodsCount: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.superposition-or-not' })}
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
                  label={formatMessage({ id: 'pallet-palletAdd.port.shipment' })}
                >
                  {getFieldDecorator(`startPort`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.startPort)
                        ? undefined
                        : this.state.startPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.port.shipment.null' }),
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
                      placeholder={formatMessage({ id: 'pallet-palletAdd.port.shipment.choose' })}
                      optionFilterProp="children"
                      onChange={this.selectStartPortChange}
                      filterOption={this.serach}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <Option value={item.code}>{item.textValue}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.destination' })}
                >
                  {getFieldDecorator(`destinationPort`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.destinationPort)
                        ? undefined
                        : this.state.destinationPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'pallet-palletAdd.destination.null' }),
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
                      placeholder={formatMessage({ id: 'pallet-palletAdd.destination.choose' })}
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
            {!isNil(this.state) && this.state.unloadingflag ?
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    {...formlayout}
                    label={formatMessage({ id: 'pallet-palletAdd.unloading.days' })}
                  >
                    {getFieldDecorator(`unloadingDays`, {
                      initialValue:
                        isNil(this.state) || isNil(this.state.unloadingDays)
                          ? ''
                          : this.state.unloadingDays,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'pallet-palletAdd.unloading.days.null' }),
                        },
                        {
                          validator: checkNumber.bind(this)
                        },
                      ],
                    })(
                      <Input
                        maxLength={15}
                        placeholder={formatMessage({ id: 'pallet-palletAdd.unloading.days.enter' })}
                        suffix={formatMessage({ id: 'pallet-palletAdd.day' })}
                        onChange={e => this.setState({ unloadingDays: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formlayout}
                    label={formatMessage({ id: 'pallet-palletAdd.lessloading.rate' })}
                  >
                    {getFieldDecorator(`loadingUnloadingVolume`, {
                      initialValue:
                        isNil(this.state) || isNil(this.state.loadingUnloadingVolume)
                          ? ''
                          : this.state.loadingUnloadingVolume,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'pallet-palletAdd.lessloading.rate.null' }),
                        },
                        {
                          validator: checkRate.bind(this)
                        },
                      ],
                    })(
                      <Input
                        maxLength={3}
                        type='number'
                        min={-100}
                        max={100}
                        step={0.01}
                        placeholder={formatMessage({ id: 'pallet-palletAdd.lessloading.rate.enter' })}
                        suffix="%"
                        onChange={e => this.setState({ loadingUnloadingVolume: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              : null}
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
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.linkman' })}
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
                  label={formatMessage({ id: 'pallet-palletAdd.contact.way' })}
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

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'pallet-palletAdd.whether.ItIs.heavyOrNot' })}
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
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  required
                  label={formatMessage({ id: 'pallet-palletAdd.add.goods.list' })}
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
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="TurnDown"
                  text={formatMessage({ id: 'pallet-palletAdd.save' })}
                  disabled={!isNil(this.state) && this.state.picflag}
                  event={() => {
                    this.handleSubmit(1, this.state.flag);
                  }}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({ id: 'pallet-palletAdd.save-and-submit' })}
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
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
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
        this.handleSubmit(2, this.state.flag);
      },
    });
  }
}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
