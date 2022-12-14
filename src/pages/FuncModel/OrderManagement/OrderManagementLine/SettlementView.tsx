import ButtonOptionComponent from '@/pages/Common/Components/ButtonOptionComponent';
import HrComponent from '@/pages/Common/Components/HrComponent';
import LabelTitleComponent from '@/pages/Common/Components/LabelTitleComponent';
import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Icon, Input, message, Modal, Row, Upload } from 'antd';
import { forEach, isNil } from 'lodash';
import React from 'react';
import commonCss from '../../../Common/css/CommonCss.less';
import { Attachments, SettlementFormProps, VoyagePort } from './SettlementFormInterface';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { FileMsg } from '../OrderViewInterface';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { HandleBeforeUpload } from '@/utils/validator';

const { confirm } = Modal;

class SettlementView extends React.Component<SettlementFormProps, SettlementFormProps> {
  constructor(props: SettlementFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState(
      {
        previewVisible: false,
        previewImage: '',
        cFileList: [],
        uploadResult: [],
        type: '',
        fileName: '',
        guid: '',
        settlementflag: false,
      },
      () => {
        let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
        let param: Map<string, string> = new Map();
        param.set('type', '1');
        getRequest('/business/order/' + uid, param, (response: any) => {
          if (response.status === 200) {
            if (!isNil(response.data)) {
              const money = Number(response.data.order.contractMoney * 1.25/100).toFixed(2);
              this.setState({
                voyage: response.data.orderVoyage.voyage, //航次对象
                voyagePort: response.data.orderVoyage.voyagePort, //航线途径港
                pallet: response.data.orderPallet.pallet, //货盘对象
                order: response.data.order, //订单对象
                ship: response.data.orderVoyage.ship, //船舶对象
                voyageLineName: response.data.orderVoyage.voyageLineName,
                attachments: response.data.attachments, //附件
                checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
                downpayment: response.data.order.downpayment,
                contractMoney: response.data.order.contractMoney,
                guid: response.data.order.guid,
                commission: Number(money), //佣金
                estimatedCost:
                Number(this.Subtr(response.data.order.contractMoney,this.Subtr(response.data.order.downpayment,money))), //估算费用
              });
              const goods = response.data.orderPallet.palletFileList;
              let data: FileMsg[] = [];
              forEach(goods, (attachment, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', attachment.fileName);
                getRequest(
                  '/sys/file/getThumbImageBase64/' + attachment.type, //BUG131改修fileType.pallet_add
                  picParams,
                  (response2: any) => {
                    if (response2.status === 200) {
                      let fileLists: FileMsg = {};
                      if(goods.length === 2){
                        fileLists.uid = index;
                        fileLists.name = response2.data[0].fileName;
                        fileLists.status = 'done';
                        fileLists.thumbUrl = response2.data[0].base64;
                        // 图片排序，第二张显示审核上传的图片
                        if(attachment.fileLog === 2){
                          data[0] = fileLists;
                        }else if(attachment.fileLog === 24){
                          data[1] = fileLists;
                        }
                      }else{
                        fileLists.uid = index;
                        fileLists.name = response2.data[0].fileName;
                        fileLists.status = 'done';
                        fileLists.thumbUrl = response2.data[0].base64;
                        data.push(fileLists);
                      }
                      if (data.length === goods.length) {
                        this.setState({
                          cFileList: data,
                        });
                      }
                    }
                  },
                );
              });
            }
          }
        });
      },
    );
  }

  // 减法避免丢精度
  Subtr(arg1:any,arg2:any){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
    }

  // 返回
  onBack = () => {
    this.props.history.push('/orderManagementExamine');
  };

  // 图片预览

  handlePreview = async (type: any, file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + file.response.data.type, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    } else {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.name);
      getRequest('/sys/file/getImageBase64/' + type, params, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              previewImage: response.data.file.base64,
              previewVisible: true,
            });
          }
        }
      });
    }
  };

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  //上传图片变更
  handleChangeSettlement = (info: any) => {
    const dataSource = this.state.uploadResult;
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: Attachments = { type: '', fileName: '', fileLog: '' };
      fileLists.type = fileType.ship_settle;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = '21';
      dataSource.push(fileLists);
      this.setState({ settlementflag: false });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ settlementflag: true });
    }
    this.setState({
      settlementFile: info.fileList,
      uploadResult: dataSource,
    });
  };

  checkFileSettlement = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.settlementFile) || this.state.settlementFile.length === 0) {
      callback('上传图片不能为空!');
    } else {
      callback();
    }
  };

  onRemoveSettlement = () => {
    this.setState({
      settlementFile: [],
      uploadResult: [],
    });
  };

  // 结算
  settlement = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        confirm({
          title: '是否确认结算',
          okText: '是',
          cancelText: '否',
          onOk: () => {
            let requestData = {};
            requestData = {
              guid: this.props.match.params['guid'],
              type: '1',
              uploadResult: this.state.uploadResult,
            };
            putRequest(
              '/business/order/settlement',
              JSON.stringify(requestData),
              (response: any) => {
                if (response.status === 200) {
                  // 跳转首页
                  this.props.history.push('/orderManagementExamine');
                  message.success('结算成功', 2);
                }
              },
            );
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const smallerFormItemLayout = {
      labelCol: { span: 18 },
      wrapperCol: { span: 6 },
    };
    let voyagePortList =
      isNil(this.state) || isNil(this.state.voyagePort) ? null : this.state.voyagePort;
    const elements: JSX.Element[] = [];
    forEach(voyagePortList, (item: VoyagePort, key) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item required {...formlayout} label={item.portTypeName}>
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item required {...formlayout} label={'ETA'}>
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item required {...formlayout} label={'ETD'}>
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.leaveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={'航次信息'} event={() => this.onBack()} />
        <Form labelAlign="left">
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶名称">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipName)
                        ? ''
                        : this.state.ship.shipName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船型">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipDeck)
                        ? ''
                        : getTableEnumText('ship_deck', this.state.ship.shipDeck)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶类型">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipType)
                        ? ''
                        : getTableEnumText('ship_type', this.state.ship.shipType)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="建造年份">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.buildParticularYear)
                        ? ''
                        : this.state.ship.buildParticularYear
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="载重吨">
                  <Input
                    disabled
                    suffix="吨"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.tonNumber)
                        ? ''
                        : this.state.ship.tonNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船吊">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.shipCrane)
                        ? ''
                        : this.state.ship.shipCrane
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶吃水">
                  <Input
                    disabled
                    suffix="m"
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.draft)
                        ? ''
                        : this.state.ship.draft
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="所在港口">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.voyageStartPort)
                        ? ''
                        : getTableEnumText('port', this.state.voyage.voyageStartPort)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="联系人">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.contacter)
                        ? ''
                        : this.state.voyage.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item required {...smallerFormItemLayout} label="联系方式">
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '22%', textAlign: 'center' }}
                    className="telinput"
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.phoneCode)
                        ? ''
                        : this.state.voyage.phoneCode
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8} {...smallFormItemLayout}>
                <Form.Item required>
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '' }}
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.contactPhone)
                        ? ''
                        : this.state.voyage.contactPhone
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="可接受体积">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="m³"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.acceptCapacity)
                        ? ''
                        : this.state.voyage.acceptCapacity
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="可接受吨位">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="吨"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.acceptTon)
                        ? ''
                        : this.state.voyage.acceptTon
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶航程">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="海里"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.voyage) ||
                      isNil(this.state.voyage.shipVoyage)
                        ? ''
                        : this.state.voyage.shipVoyage
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
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="已定航线">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.voyageLineName)
                        ? ''
                        : this.state.voyageLineName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ background: 'rgba(244,244,244,1)' }}>{elements}</div>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>货盘信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col>
                <Form.Item label="货物清单" required className={commonCss.detailPageLabel}>
                  <Upload
                    action=""
                    listType="picture-card"
                    data={{ type: 1 }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={
                      isNil(this.state) ||
                      isNil(this.state.cFileList) ||
                      this.state.cFileList.length === 0
                        ? ''
                        : this.state.cFileList
                    }
                    onPreview={this.handlePreview.bind(this, fileType.pallet_add)}
                  >
                    {isNil(this.state) ||
                    isNil(this.state.cFileList) ||
                    this.state.cFileList.length === 0
                      ? null
                      : null}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物名称">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsLevel)
                        ? ''
                        : getTableEnumText('goods_name', this.state.pallet.goodsLevel)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物类型">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsType)
                        ? ''
                        : getTableEnumText('goods_type', this.state.pallet.goodsType)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物存放位置">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.location)
                        ? ''
                        : getTableEnumText('cargo_save_location', this.state.pallet.location)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物性质">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsProperty)
                        ? ''
                        : getTableEnumText('goods_property', this.state.pallet.goodsProperty)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物重量">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="吨"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsWeight)
                        ? ''
                        : this.state.pallet.goodsWeight
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="体积">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="m³"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsVolume)
                        ? ''
                        : this.state.pallet.goodsVolume
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="货物件数">
                  <Input
                    disabled
                    suffix="件"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.goodsCount)
                        ? ''
                        : this.state.pallet.goodsCount
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="是否可叠加">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.isSuperposition)
                        ? ''
                        : getTableEnumText('is_superposition', this.state.pallet.isSuperposition)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="起运港">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.startPort)
                        ? ''
                        : getTableEnumText('port', this.state.pallet.startPort)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="目的港">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.destinationPort)
                        ? ''
                        : getTableEnumText('port', this.state.pallet.destinationPort)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {(!isNil(this.state) && !isNil(this.state.pallet) && String(this.state.pallet.goodsProperty) === '3') ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="卸货天数">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="天"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.unloadingDays)
                        ? ''
                        : this.state.pallet.unloadingDays
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="装卸货量">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="%"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.loadingUnloadingVolume)
                        ? ''
                        : this.state.pallet.loadingUnloadingVolume
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            : null}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="受载日期">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.loadDate)
                        ? ''
                        : moment(Number(this.state.pallet.loadDate)).format('YYYY/MM/DD')
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="截止日期">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.endDate)
                        ? ''
                        : moment(Number(this.state.pallet.endDate)).format('YYYY/MM/DD')
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item required {...formlayout} label="联系人">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.contacter)
                        ? ''
                        : this.state.pallet.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item required {...smallerFormItemLayout} label="联系方式">
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '22%', textAlign: 'center' }}
                    className="telinput"
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.phoneCode)
                        ? ''
                        : this.state.pallet.phoneCode
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8} {...smallFormItemLayout}>
                <Form.Item required>
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '' }}
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.pallet) ||
                      isNil(this.state.pallet.contactPhone)
                        ? ''
                        : this.state.pallet.contactPhone
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
          </div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>结算信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="订单总金额">
                  <Input
                    disabled
                    suffix="￥"
                    value={
                      isNil(this.state) || isNil(this.state.contractMoney)
                        ? ''
                        : this.state.contractMoney
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="定金">
                  <Input
                    disabled
                    suffix="￥"
                    value={
                      isNil(this.state) || isNil(this.state.downpayment)
                        ? ''
                        : this.state.downpayment
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="佣金">
                  <Input
                    disabled
                    suffix="￥"
                    value={
                      isNil(this.state) || isNil(this.state.commission)
                        ? ''
                        : this.state.commission
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <text>(订单总金额X1.25%)</text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="估算费用">
                  <Input
                    disabled
                    suffix="￥"
                    value={
                      isNil(this.state) || isNil(this.state.estimatedCost)
                        ? ''
                        : this.state.estimatedCost
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <text>(订单总金额-定金-佣金)</text>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item {...formlayout} label="">
                  {getFieldDecorator(`tailPic`, {
                    rules: [{ validator: this.checkFileSettlement.bind(this) }],
                  })(
                    <Upload
                      action={'/api/sys/file/upload/' + fileType.ship_settle}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                        isNil(this.state.settlementFile) ||
                        this.state.settlementFile.length === 0
                          ? ''
                          : this.state.settlementFile
                      }
                      onPreview={this.handlePreview.bind(this, fileType.ship_settle)}
                      onChange={this.handleChangeSettlement}
                      onRemove={this.onRemoveSettlement}
                    >
                      {isNil(this.state) ||
                      isNil(this.state.settlementFile) ||
                      this.state.settlementFile.length === 0
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
              <Col span={16}></Col>
            </Row>
          </div>
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                type="TurnDown"
                text="取消"
                event={() => this.onBack()}
                disabled={false}
              />
            </Col>
            <Col span={12}>
              <ButtonOptionComponent
                type="Approve"
                text="结算"
                event={() => this.settlement()}
                disabled={!isNil(this.state) && this.state.settlementflag}
              />
            </Col>
          </Row>
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
              src={
                isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage
              }
            />
            <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
          </Modal>
        </Form>
      </div>
    );
  }
}

const SettlementView_Form = Form.create({ name: 'SettlementView_Form' })(SettlementView);

export default SettlementView_Form;
