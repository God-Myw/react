import HrComponent from '@/pages/Common/Components/HrComponent';
import { getRequest, putRequest } from '@/utils/request';
import { Col, Form, Icon, Input, message, Modal, Row, Upload } from 'antd';
import { filter, forEach, isNil, remove } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import AdvanceorderFormProps, { Attachments } from './AdvanceorderFormInterface';
import { FileModel } from './FileModel';
import GoodsListForm from './GoodsList';
import ShipForm from './Ship';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';

const dataSource: FileModel[] = [];
class AdvanceorderAdd extends React.Component<AdvanceorderFormProps, AdvanceorderFormProps> {
  constructor(props: AdvanceorderFormProps) {
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
        aFileList: dataSource,
        bFileList: dataSource,
        cFileList: dataSource,
        type: '',
        fileName: '',
        downpayment: '',
        contractMoney: '',
        contractMoneyDollar:'',
        downpaymentDollar:'',
        guid: '',
        agreement: false,
        document: false,
      },
      () => {
        let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
        if (uid) {
          let param: Map<string, string> = new Map();
          param.set('type', '1');
          getRequest('/business/order/' + this.props.match.params['guid'], param, (response: any) => {
            if (response.status === 200) {
              if (!isNil(response.data)) {
                //  if (response.data.userDataChecks.guid === id) {
                this.setState({
                  voyage: response.data.orderVoyage.voyage,//航次对象
                  voyagePort: response.data.orderVoyage.voyagePort,//航线途径港
                  pallet: response.data.orderPallet.pallet,//货盘对象
                  remark: response.data.orderPallet.pallet.remark,
                  order: response.data.order,//订单对象
                  ship: response.data.orderVoyage.ship,//船舶对象
                  voyageLineName: response.data.orderVoyage.voyageLineName,
                  attachments: response.data.attachments,//附件
                  checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
                  downpayment: response.data.order.downpayment,
                  contractMoney: response.data.order.contractMoney,
                  contractMoneyDollar: response.data.order.contractMoneyDollar,
                  downpaymentDollar: response.data.order.downpaymentDollar,
                  guid: response.data.order.guid,
                  orderNumber: response.data.order.orderNumber,
                });
                const activeArr = filter(response.data.attachments, { 'fileLog': 12 });
                const aactiveArr = filter(response.data.attachments, { 'fileLog': 11 });
                const goods = response.data.orderPallet.palletFileList;
                let data_Source: FileModel[] = [];
                let data_source: FileModel[] = [];
                let data: FileModel[] = [];
                let a: Attachments[] = [];
                let b: Attachments[] = [];
                forEach(aactiveArr, (attachment, index) => {
                  if (attachment.fileLog === 11) {
                    let xieyiFileList: Attachments = { type: '', fileName: '', fileLog: 11 };
                    xieyiFileList.fileName = attachment.fileName;
                    xieyiFileList.type = attachment.fileType;
                    xieyiFileList.fileLog = attachment.fileLog;
                    a.push(xieyiFileList);
                    let picParams: Map<string, string> = new Map();
                    picParams.set('fileNames', attachment.fileName);
                    getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response: any) => { //BUG131改修fileType.ship_agreement
                      if (response.status === 200) {
                        let fileList: FileModel = {};
                        fileList.uid = index;
                        fileList.name = response.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response.data[0].base64;
                        data_source.push(fileList);
                        if (data_source.length === aactiveArr.length) {
                          this.setState({
                            aFileList: data_source,
                            picNum: data_source.length,
                            xieyi: a,
                          });
                        }
                      }
                    });
                  }
                });
                forEach(activeArr, (attachment, index) => {
                  if (attachment.fileLog === 12) {
                    let danzhengFileList: Attachments = { type: '', fileName: '', fileLog: 12 };
                    danzhengFileList.fileName = attachment.fileName;
                    danzhengFileList.type = attachment.fileType;
                    danzhengFileList.fileLog = attachment.fileLog;
                    b.push(danzhengFileList);
                    let picParams: Map<string, string> = new Map();
                    picParams.set('fileNames', attachment.fileName);
                    getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response1: any) => {//BUG131改修fileType.ship_document
                      if (response1.status === 200) {
                        let fileList: FileModel = {};
                        fileList.uid = index;
                        fileList.name = response1.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response1.data[0].base64;
                        data_Source.push(fileList);
                        if (data_Source.length === activeArr.length) {
                          this.setState({
                            bFileList: data_Source,
                            picNum: data_Source.length,
                            danzheng: b,
                          });
                        }
                      }
                    });
                  }
                });
                forEach(goods, (attachment, index) => {
                  let picParams: Map<string, string> = new Map();
                  picParams.set('fileNames', attachment.fileName);
                  getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => {//BUG131改修fileType.pallet_add
                    if (response2.status === 200) {
                      let fileLists: FileModel = {};
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
                  });
                });
              }
            }
          });
        }
      },
    );
  }

  contractMoneyChange = (e: any) => {
    this.setState({
      contractMoney: e.target.value,
    },()=>{
      if(!isNil(this.state.downpayment)){
        this.props.form.validateFields(['downpayment','contractMoney']);
      }
    });
  }

  downpaymentChange = (e: any) => {
    this.setState({
      downpayment: e.target.value,
    },()=>{
      if(!isNil(this.state.contractMoney)){
        this.props.form.validateFields(['downpayment','contractMoney']);
      }
    });
  }

  contractMoneyChangeDollar = (e: any) => {
    this.setState({
      contractMoneyDollar: e.target.value,
    },()=>{
      if(!isNil(this.state.downpaymentDollar)){
        this.props.form.validateFields(['downpaymentDollar','contractMoneyDollar']);
      }
    });
  }
  downpaymentChangeDollar = (e: any) => {
    this.setState({
      downpaymentDollar: e.target.value,
    },()=>{
      if(!isNil(this.state.contractMoneyDollar)){
        this.props.form.validateFields(['downpaymentDollar','contractMoneyDollar']);
      }
    });
  }

  // 返回
  onBack = () => {
    this.props.history.push('/advanceorder/list/' + this.props.match.params['status']);
  };

  // 协议预览
  ahandlePreview = (file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + fileType.ship_agreement, params, (response: any) => {
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
      getRequest('/sys/file/getImageBase64/' + fileType.ship_agreement, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    }
  };

  // 单证预览
  bhandlePreview = (file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + fileType.ship_document, params, (response: any) => {
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
      getRequest('/sys/file/getImageBase64/' + fileType.ship_document, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    }
  };

  // 货物清单预览
  chandlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + fileType.pallet_add, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };

  // 检查单证是否上传
  checkFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.bFileList) || this.state.bFileList.length === 0) {
      callback(formatMessage({ id: 'pallet-palletAdd.upload.picture.null' }));
    } else {
      callback();
    }
  };

  // 检查协议是否上传
  checkFilea = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.aFileList) || this.state.aFileList.length === 0) {
      callback(formatMessage({ id: 'pallet-palletAdd.upload.picture.null' }));
    } else {
      callback();
    }
  };

  //删除单证图片
  onRemove = (file: any) => {
    const oldFileList = this.state.bFileList;
    const attachments = this.state.danzheng;
    let delIndex = 0;
    forEach(oldFileList, (eachFile, index) => {
      if (file.uid === eachFile.uid) {
        delIndex = Number(index);
      }
    });
    const types: Attachments[] = [];
    forEach(attachments, (attachment, index) => {
      if (Number(index) !== Number(delIndex)) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      bFileList: remove(oldFileList,
        function (item: any) {
          return item.fileName != file.fileName;
        }),
      danzheng: types,
    }));
  }

  //删除协议图片
  aonRemove = (file: any) => {
    const oldFileList = this.state.aFileList;
    const attachments = this.state.xieyi;
    let delIndex = 0;
    forEach(oldFileList, (eachFile, index) => {
      if (file.uid === eachFile.uid) {
        delIndex = Number(index);
      }
    });
    const types: Attachments[] = [];
    forEach(attachments, (attachment, index) => {
      if (Number(index) !== Number(delIndex)) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      aFileList: remove(oldFileList,
        function (item: any) {
          return item.fileName !== file.fileName;
        }),
      xieyi: types,
    }));
  }

  //取消预览
  handleCancel = () => {
    this.setState({
      previewVisible: false,
      previewImage: undefined
    });
  };

  //单证图片变更
  handleChange = (info: any) => {
    let count = 0;
    const dataSource = this.state.danzheng ? this.state.danzheng : [];
    if (!isNil(info.file.status) && (info.file.status === 'done')) {
      if (info.file.response.status === 200) {
        let fileLists: Attachments = { type: '', fileName: '', fileLog: 12 };
        fileLists.type = info.file.response.data.type;
        fileLists.fileName = info.file.response.data.fileName;
        fileLists.fileLog = 12
        dataSource.push(fileLists);
      }
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ document: true });
    }
    this.setState({
      bFileList: info.fileList, danzheng: dataSource
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++
      }
    });
    if (count === info.fileList.length) {
      this.setState({ document: false, })
    }
  }

  //协议图片变更
  ahandleChange = (info: any) => {
    let count = 0;
    const dataSource = this.state.xieyi ? this.state.xieyi : [];
    if (!isNil(info.file.status) && (info.file.status === 'done')) {
      if (info.file.response.status === 200) {
        let fileLists: Attachments = { type: '', fileName: '', fileLog: 11 };
        fileLists.type = info.file.response.data.type;
        fileLists.fileName = info.file.response.data.fileName;
        fileLists.fileLog = 11;
        dataSource.push(fileLists);
      }
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ agreement: true });
    }
    this.setState({
      aFileList: info.fileList, xieyi: dataSource
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++
      }
    });
    if (count === info.fileList.length) {
      this.setState({ agreement: false, })
    }
  }

  //保存并提交
  handleSubmit(type: number) {
    if (type === 0 || type === 2) {
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          let xieyi = this.state.xieyi;
          let danzheng = this.state.danzheng;
          forEach(xieyi, (eachFile, index) => {
            danzheng.push(eachFile);
          });
          let requestData = {};
          requestData = {
            type: 1,
            guid: this.state.guid,
            orderNumber: this.state.orderNumber,
            downpayment: Number(this.state.downpayment),
            contractMoney: Number(this.state.contractMoney),
            uploadResult: danzheng,
            palletId: this.state.pallet.guid,
            palletRemark: this.state.remark,
            contractMoneyDollar: Number(this.state.contractMoneyDollar),
            downpaymentDollar: Number(this.state.downpaymentDollar),
          };
          console.log(requestData);
          // 修改请求
          putRequest('/business/order', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              message.success('申请审核成功');
              this.props.history.push('/advanceorder/list/' + this.props.match.params['status']);
            } else {
              message.error('申请审核失败');
            }
          });
        }
      });
    }
  }

  //check金额
  checkMoney = (name:string, rule: any, val: any, callback: any) => {
    if (val !== '' && Number(val) < 0) {
      callback('有效数值应该大于0');
    }else if(val !== '' && !/^[0-9]+(.[0-9]{1,2})?$/.test(val)){
      callback('只能输入小数点后2位有效数值!');
    }else{
      if(name==='contractMoney'&&!isNil(this.state.downpayment)){
        if (Number(val) >= Number(this.state.downpayment)) {
          callback();
        } else {
          callback('定金需小于合同总金额!');
        }
      }else if(name==='downpayment'&&!isNil(this.state.contractMoney)){
        if (Number(val) <= Number(this.state.contractMoney)) {
          callback();
        } else {
          callback('定金需小于合同总金额!');
        }
      }
    }
  };

  checkMoneyDollar = (name:string, rule: any, val: any, callback: any) => {
    if (val !== '' && Number(val) < 0) {
      callback('有效数值应该大于0');
    }else if(val !== '' && !/^[0-9]+(.[0-9]{1,2})?$/.test(val)){
      callback('只能输入小数点后2位有效数值!');
    }else{
      if(name==='contractMoneyDollar'&&!isNil(this.state.downpaymentDollar)){
        if (Number(val) >= Number(this.state.downpaymentDollar)) {
          callback();
        } else {
          callback('定金需小于合同总金额!');
        }
      }else if(name==='downpaymentDollar'&&!isNil(this.state.contractMoneyDollar)){
        if (Number(val) <= Number(this.state.contractMoneyDollar)) {
          callback();
        } else {
          callback('定金需小于合同总金额!');
        }
      }
    }
  };

  render() {
    const formlayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div>
        <div className={commonCss.container}>
          <LabelTitleComponent text={this.props.match.params['status'] === '0' ? '申请审核' : '查看审核'} event={() => this.onBack()} />
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Form.Item label="协议上传" required className={commonCss.detailPageLabel}>
                  {getFieldDecorator(`picture1`, {
                    rules: [
                      {
                        validator: this.checkFilea.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_agreement}
                      listType="picture-card"
                      accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: true }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.aFileList) ||
                          this.state.aFileList.length === 0
                          ? ''
                          : this.state.aFileList
                      }
                      onRemove={this.aonRemove}
                      onPreview={this.ahandlePreview}
                      onChange={this.ahandleChange}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.aFileList) ||
                        this.state.aFileList.length < 5
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={24}>
                <Form.Item label="单证上传" required className={commonCss.detailPageLabel}>
                  {getFieldDecorator(`picture`, {
                    rules: [
                      {
                        validator: this.checkFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_document}
                      listType="picture-card"
                      accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: true }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.bFileList) ||
                          this.state.bFileList.length === 0
                          ? ''
                          : this.state.bFileList
                      }
                      onRemove={this.onRemove}
                      onPreview={this.bhandlePreview}
                      onChange={this.handleChange}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.bFileList) ||
                        this.state.bFileList.length < 8
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={24}>

              </Row>
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
            </Form>
          </div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>金额信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="right">
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item {...formlayout} label="合同总金额：￥" colon={false}>
                    {getFieldDecorator('contractMoney', {
                      rules: [
                        {
                          required: true,
                          message: '合同总金额不能为空!',
                        },
                        {
                          validator: this.checkMoney.bind(this,'contractMoney')
                        },
                      ],
                      initialValue: isNil(this.state) || isNil(this.state.contractMoney)
                        ? 0
                        : this.state.contractMoney,
                    })(
                      <Input
                        maxLength={12}
                        placeholder="请输入合同总金额"
                        value={isNil(this.state) || isNil(this.state.contractMoney)
                          ? ''
                          : this.state.contractMoney}
                        style={{ color: 'red', marginTop: '1%', width: '200px' }}
                        onChange={this.contractMoneyChange}
                      />)}
                  </Form.Item>
                </Col>

                <Col span={7}>
                  <Form.Item {...formlayout} label="定金：￥" colon={false}>
                  {getFieldDecorator('downpayment', {
                      rules: [
                        {
                          required: true,
                          message: '定金不能为空!',
                        },
                        {
                          validator: this.checkMoney.bind(this,'downpayment')
                        }
                      ],
                      initialValue: isNil(this.state) || isNil(this.state.downpayment)
                        ? 0
                        : this.state.downpayment,
                    })(
                      <Input
                        maxLength={12}
                        placeholder="请输入定金"
                        value={isNil(this.state) || isNil(this.state.downpayment)
                          ? ''
                          : this.state.downpayment}
                        style={{ color: 'red', marginTop: '1%', width: '200px' }}
                        onChange={this.downpaymentChange}
                      />)}
                  </Form.Item>
                </Col>
              </Row>


              {/* 美元 */}
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item {...formlayout} label="$" colon={false}>
                    {getFieldDecorator('contractMoneyDollar', {
                      rules: [
                        {
                          required: true,
                          message: '合同总金额不能为空!',
                        },
                        {
                          validator: this.checkMoneyDollar.bind(this,'contractMoneyDollar')
                        },
                      ],
                      initialValue: isNil(this.state) || isNil(this.state.contractMoneyDollar)
                        ? 0
                        : this.state.contractMoneyDollar,
                    })(
                      <Input
                        maxLength={12}
                        placeholder="请输入合同总金额"
                        value={isNil(this.state) || isNil(this.state.contractMoneyDollar)
                          ? ''
                          : this.state.contractMoneyDollar}
                        style={{ color: 'red', marginTop: '1%', width: '200px' }}
                        onChange={this.contractMoneyChangeDollar}
                      />)}
                  </Form.Item>
                </Col>

                <Col span={7}>
                  <Form.Item {...formlayout} label="$" colon={false}>
                  {getFieldDecorator('downpaymentDollar', {
                      rules: [
                        {
                          required: true,
                          message: '定金不能为空!',
                        },
                        {
                          validator: this.checkMoneyDollar.bind(this,'downpaymentDollar')
                        }
                      ],
                      initialValue: isNil(this.state) || isNil(this.state.downpaymentDollar)
                        ? 0
                        : this.state.downpaymentDollar,
                    })(
                      <Input
                        maxLength={12}
                        placeholder="请输入定金"
                        value={isNil(this.state) || isNil(this.state.downpaymentDollar)
                          ? ''
                          : this.state.downpaymentDollar}
                        style={{ color: 'red', marginTop: '1%', width: '200px' }}
                        onChange={this.downpaymentChangeDollar}
                      />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
            </Form>
          </div>
          <ShipForm {...this.props} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>货盘信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <GoodsListForm {...this.props} />
              <Row gutter={24}>
                <Col>
                  <Form.Item label="货物清单" className={commonCss.detailPageLabel}>
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.pallet_add}
                      listType="picture-card"
                      accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.cFileList) ||
                          this.state.cFileList.length === 0
                          ? ''
                          : this.state.cFileList
                      }
                      onPreview={this.chandlePreview}
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
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col>
                  <Form.Item {...smallFormItemLayout} label="备注">
                    <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                    value={
                        isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                      }
                      onChange={e => this.setState({ remark: e.target.value })}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            {isNil(this.state) || isNil(this.state.checkRemark) || this.props.match.params['status'] != '2' ? null : (<Col span={12}>
              <Form.Item {...formlayout} label="审批意见" style={{ marginLeft: '-10%' }}>
                <span>{this.state.checkRemark}</span>
              </Form.Item>
            </Col>)}
          </Row>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              {this.props.match.params['status'] === '0' ? (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="申请审核"
                    event={() => this.handleSubmit(0)}
                    disabled={!isNil(this.state) && (this.state.document || this.state.agreement)}
                  />
                </Col>
              ) : null}


              {this.props.match.params['status'] === '2' ? (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="SaveAndCommit"
                    text="保存并提交"
                    event={() => this.handleSubmit(2)}
                    disabled={!isNil(this.state) && (this.state.document || this.state.agreement)}
                  />
                </Col>
              ) : null}

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
}

const AdvanceorderCheck_Form = Form.create({ name: 'AdvanceorderCheck_Form' })(AdvanceorderAdd);

export default AdvanceorderCheck_Form;
