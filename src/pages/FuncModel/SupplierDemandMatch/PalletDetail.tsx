// Höre nie auf zu lächeln, egal wie schlimm dein Leben ist. Denn du weißt nicht, wer sich in dein Lächeln verlieben könnte
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, message, Icon, Button, Select, List, Card, Avatar } from 'antd';
import { isNil, forEach } from 'lodash';
import moment from 'moment';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps from './PalletFormInterface';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { FileModel } from '../Advanceorder/FileModel';
import ManagerLeft from '@/layouts/ManagerLeft';

const InputGroup = Input.Group;
// import { InputNumber } from 'antd';
// import reqwest from 'reqwest';
// import InfiniteScroll from 'react-infinite-scroller';

let id_t = 0;
let oldRemark = '';
const { Option } = Select;
class PalletAdd extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);

  }
  onBack = () => {
    this.props.history.goBack();
  };



  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let BBB = this.props.match.params['id'] ? this.props.match.params['id'] : '';
    // console.log(this.props.match.params['id']);
    // console.log(this.props.match.params['guid']);

    let params: Map<string, any> = new Map();
    params.set('type', 1);
    params.set('matchId', BBB)
    getRequest('/business/pallet/' + uid, params, (response: any) => {
      // console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          if (!isNil(response.data.palletFileList)) {
            const goods = response.data.palletFileList;
            let data_Source: FileModel[] = [];
            forEach(goods, (attachment, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', attachment.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => { //BUG131改修fileType.pallet_add
                if (response2.status === 200) {
                  let fileLists: FileModel = {};
                  if(goods.length === 2){
                    fileLists.uid = index;
                    fileLists.name = response2.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = response2.data[0].base64;
                    // 图片排序，第二张显示审核上传的图片
                    if(attachment.fileLog === 2){
                      data_Source[0] = fileLists;
                    }else if(attachment.fileLog === 24){
                      data_Source[1] = fileLists;
                    }
                  }else{
                    fileLists.uid = index;
                    fileLists.name = response2.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = response2.data[0].base64;
                    data_Source.push(fileLists);
                  }
                  if (data_Source.length === goods.length) {
                    this.setState({
                      fileList: data_Source,
                    });
                  }
                }
              });
            });
          }
          let CG = (response.data.pallet.CGUID).substring(0, 1)
          // console.log(response.data.quotationDto[0].type)
          // let quotationDto_guid = (response.data.quotationDto[0].guid)
          this.baojia(CG);
          this.jianyi();
          this.baoji_ziding();
          this.setState({
            CGCG:CG,
            CGUID: response.data.pallet.CGUID,
            unionTransport: response.data.pallet.unionTransport,
            isBind: response.data.pallet.isBind,
            isGangji: response.data.pallet.isGangji,
            insuranceJiangyun:response.data.pallet.insuranceJiangyun,
            insuranceKache:response.data.pallet.insuranceKache,
            insuranceHaiyun:response.data.pallet.insuranceHaiyun,
            addCommission:response.data.pallet.addCommission,
            commission:response.data.pallet.commission,
            quotationDto:response.data.quotationDto,
            weightMax:response.data.pallet.weightMax,
            weightMin:response.data.pallet.weightMin,

            remarkTwo:response.data.pallet.remarkTwo,

            goodsLevel: response.data.pallet.goodsLevel,
            goodsType: response.data.pallet.goodsType,
            location: response.data.pallet.location,
            goodsProperty: response.data.pallet.goodsProperty,
            goodsWeight: response.data.pallet.goodsWeight,
            goodsVolume: response.data.pallet.goodsVolume,
            goodsCount: response.data.pallet.goodsCount,
            goodsMaxWeight: response.data.pallet.goodsMaxWeight,
            isSuperposition: response.data.pallet.isSuperposition,
            startPort: response.data.pallet.startPort,
            destinationPort: response.data.pallet.destinationPort,
            loadDate: response.data.pallet.loadDate,
            endDate: response.data.pallet.endDate,
            contacter: response.data.pallet.contacter,
            phoneCode: response.data.pallet.phoneCode,
            contactPhone: response.data.pallet.contactPhone,
            loadingUnloadingVolume: response.data.pallet.loadingUnloadingVolume,
            unloadingDays: response.data.pallet.unloadingDays,
            majorParts: response.data.pallet.majorParts === 1 ? '是' : '否',
            remark:response.data.pallet.remark,
            remark_1:response.data.pallet.remark,
            unloadingflag: response.data.pallet.goodsProperty === 3 ? true : false,
            intentionMoney:response.data.pallet.intentionMoney,
            // quotationDto:response.data.pallet.quotationDto,
          });

          oldRemark = response.data.pallet.remark;
        }
      }
    });
    // isNil(this.state) || isNil(this.state.CGCG) ? '' : this.state.CGCG === 'G'?AAAA = 1:AAAA = 0;

  }

  //添加其他报价——删除
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k)
    });
  };
 //添加其他报价——添加
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id_t++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };
 //添加其他报价——输出
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa } = values;
        // console.log(keys.map((key) => ['names:'+names[key], 'money:'+aa[key]]));
      }
    });
  };

    //提交报价
    selectC = () => {
      // let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
      let BBB = this.props.match.params['id'] ? this.props.match.params['id'] : '';
      // let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
      // let matchId = this.setState.matchId;
      // let moneyType = this.state.moneyType ? this.state.moneyType  : 1 ;

      let lianheMoney = this.state.lianheMoney === '' ? '' : this.state.lianheMoney
      // let lianheMoney = 1111;
      let bangzhaMoney = this.state.bangzhaMoney ? this.state.bangzhaMoney : '';
      // let jigangMoney = this.state.jigangMoney ? this.state.jigangMoney : '';
      let jianghaiyunMoney = this.state.jianghaiyunMoney ? this.state.jianghaiyunMoney:'' ;
      let haiyunMoney = this.state.haiyunMoney ? this.state.haiyunMoney : '';
      let kacheMoney = this.state.kacheMoney ? this.state.kacheMoney : '';
      let portOperation = this.state.portOperation ? this.state.portOperation :''; //港口操作
      let jiangangMoney = this.state.jiangangMoney ? this.state.jiangangMoney :'';
      let baoguanMoney = this.state.baoguanMoney ? this.state.baoguanMoney :'';
      let dailiMoney = this.state.dailiMoney ? this.state.dailiMoney :'';
      let lihuoMoney = this.state.lihuoMoney ? this.state.lihuoMoney :'';
      let anbaoMoney = this.state.anbaoMoney ? this.state.anbaoMoney :'';
      let remarkk = this.state.remarkk ? this.state.remarkk : '';//其他服务报价
      let requestData = {};
      // console.log(value === 0 ? this.state.checkRemark : '');
      console.log(remarkk);
      let qita ;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names, aa } = values;
          // console.log(keys.map((key) => ['names:'+names[key], 'money:'+aa[key]]));
          // let names_s = keys.map((key) => { return 'name:'+names[key]+','+'content:'+aa[key] } )
          let names_s = keys.map((key)=>{return {'name':names[key],'content':aa[key]}})
          qita = names_s
        }
      });

      console.log(qita);

      requestData = {
        matchId: BBB,
        quotationId: BBB,
        lianheMoney:lianheMoney,
        bangzhaMoney: bangzhaMoney,
        jianghaiyunMoney: jianghaiyunMoney,
        haiyunMoney: haiyunMoney,
        kacheMoney: kacheMoney,
        portOperation: portOperation,
        jiangangMoney: jiangangMoney,
        baoguanMoney: baoguanMoney,
        dailiMoney: dailiMoney,
        lihuoMoney: lihuoMoney,
        anbaoMoney: anbaoMoney,
        remarkk: remarkk,
        quotationKefuOtherDtoList: qita,

      };
      if(qita===undefined){
        message.success('展开其他报价后请输入，否则请关闭');
      }else{
        postRequest('/business/quotation/insertQuotationKefuOther', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          // this.props.history.push('/shipcertification/list');
          window.location.reload(true)
        } else {
          message.error(response.message);
        }
      });
      }

      console.log(requestData);

    };


  //报价记录
  baojia = (CG)=>{
    // console.log(CG);
    let params: Map<string, any> = new Map();

    let BBB = this.props.match.params['id'] ? this.props.match.params['id'] : '';
    // let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let AAAA = ''
    if(CG === 'C'){
        AAAA = 0
    }else{
        AAAA = 1
    }
    // params.set('type', AAAA );
    params.set('quotationId', BBB );

    // console.log(AAAA)
    getRequest('/business/quotation/getKeFuQuotation',params, (response: any) => {
      if (response.status === 200) {
        // console.log(response);
        // let quotationDto_1 = response.data.quotationDto
        if(response.data != null){
          this.setState({
            quotationDto_1: response.data,
          })
          // console.log(this.state.quotationDto_1);
        }
        // console.log(response)
      } else {
        message.error(response.message);
      }
    })

  }

  //报价记录——自定义报价
  baoji_ziding=()=>{
    let BBB = this.props.match.params['id'] ? this.props.match.params['id'] : '';
    let params: Map<string, any> = new Map();
    params.set('matchId', BBB );
    getRequest('/business/quotation/getKeFuQuotationOther', params, (response: any) => {
      if (response.status === 200) {
        // console.log(response);
        // let quotationDto_1 = response.data.quotationDto
        // response.data.map(
        //   (item)=>{
        //     console.log(item.quotationKefuOther);
        //   })

        if(response.data){

          this.setState({
            quotationDto_2:response.data
          })
          console.log(this.state.quotationDto_2);
        }
        // console.log(response)
      } else {
        message.error(response.message);
      }
    })
  }

  //价格建议接口
  jianyi = (guid)=>{
    // console.log(CG);
    // console.log(this.state.quotationDto_1,12346789);
    let params: Map<string, any> = new Map();
    let BBB = this.props.match.params['id'] ? this.props.match.params['id'] : '';
    // let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    // params.set('type', 1);
    params.set('guid',BBB)
    // console.log(guid);


    getRequest('/business/quotation/getQuotationAdviceList', params, (response: any) => {
      if (response.status === 200) {
        console.log(response.data)
        let bb = []
        response.data.map(item=>{
          item.map(aa=>{
            bb.push(aa)
          })
        })
        console.log(bb)

          this.setState({
            jianyi_1: bb,
          })
          // console.log(this.state.jianyi_1);
      } else {
        message.error(response.message);
      }
    })
  }



  // 图片预览
  handlePreview = (file: any) => {
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

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };
  //备注
  save = () => {
    if(oldRemark===this.state.remark){
      return;
    }else{
      let matchStopStatus = {};
      matchStopStatus = {
        type: 2,
        guid: Number(this.props.match.params['guid']),
        remark: this.state.remark ? this.state.remark : '',
      };
      // 修改请求
      putRequest('/business/match/remark', JSON.stringify(matchStopStatus), (response: any) => {
        if (response.status === 200) {
          oldRemark = this.state.remark;
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      });
    }
  }

  //金融单位选择
  // handleChange=(value)=> {

  //   // console.log(`selected ${value}`);
  //   this.setState({moneyType:value});

  // }





  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const smallerFormItemLayout = {
      labelCol: { span: 18 },
      wrapperCol: { span: 6 },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };

      getFieldDecorator("keys", { initialValue: [] });
      const keys = getFieldValue("keys");
      const formItems = keys.map((k, index) => (
      <Form.Item
        // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        {...formlayout}
        // label={index === 0 ? "Passengers" : ""}
        required={false}
        key={k}
      >
          <InputGroup size="large">
            <Row gutter={24}>
              <Col span={6}>
                {getFieldDecorator(`names[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "展开后请输入"
                    }
                  ]
                })(
                  <Input
                    placeholder="其他报价"
                  />
                )}
              </Col>
              <Col span={6}>
                {getFieldDecorator(`aa[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "哈哈哈哈哈"
                    }
                  ]
                })(
                  <Input
                    placeholder="金额"

                  />
                )}
              </Col>
              {keys.length >= 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Row>
          </InputGroup>

        </Form.Item>
      ));
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={isNil(this.state) || isNil(this.state.CGCG) ? '' : this.state.CGCG === 'G' ? '查看国际货盘' : '查看国内货盘'} event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left" >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="货物名称">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsLevel) ? '' : getTableEnumText('goods_name', this.state.goodsLevel)
                    }
                  />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item {...formlayout} label="货物编号">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.CGUID) ? '' : this.state.CGUID
                    }
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="货物重量">
                  <Input
                    suffix="吨"
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsMaxWeight) ? '' : this.state.goodsMaxWeight
                    }
                  />
                </Form.Item>
              </Col>
              {
                !isNil(this.state) && this.state.CGCG == 'G' ? (
                  <Col span={12}>
                    <Form.Item {...formlayout} label="体积">
                      <Input
                        suffix="m³"
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.goodsVolume) ? '' : this.state.goodsVolume
                        }
                      />
                    </Form.Item>
                  </Col>
                ):(
                  <Col span={12}>
                      <Form.Item {...formlayout} label="所需船舶吨位">
                        <Input
                          suffix="吨"
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.weightMin) || isNil(this.state.weightMax)? '' : this.state.weightMin +'至'+ this.state.weightMax
                          }
                        />
                      </Form.Item>
                  </Col>
                )
              }
              {/* weightMax
              weightMin */}
            </Row>
                {
                  !isNil(this.state) && this.state.CGCG == 'G' ? (
                    <div>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="货物存放位置">
                            <Input
                              disabled
                              value={
                                isNil(this.state) || isNil(this.state.location) ? '' : getTableEnumText('cargo_save_location', this.state.location)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="货物性质">
                            <Input
                              disabled
                              value={
                                isNil(this.state) || isNil(this.state.goodsProperty) ? '' : getTableEnumText('goods_property', this.state.goodsProperty)
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        {/* <Col span={12}>
                          <Form.Item {...formlayout} label="货物件数">
                            <Input
                              disabled
                              suffix="件"
                              value={
                                isNil(this.state) || isNil(this.state.goodsCount) ? '' : this.state.goodsCount
                              }
                            />
                          </Form.Item>
                        </Col> */}
                        <Col span={12}>
                          <Form.Item {...formlayout} label="是否为重大件">
                            <Input
                              disabled
                              className="OnlyRead"
                              value={
                                isNil(this.state) || isNil(this.state.majorParts)
                                  ? ''
                                  : this.state.majorParts
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="是否可叠加">
                            <Input
                              disabled
                              value={
                                isNil(this.state) || isNil(this.state.isSuperposition)
                                  ? ''
                                  : getTableEnumText('is_superposition', this.state.isSuperposition)
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                  </div>
              ) : null}

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="起运港">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.startPort) ? '' : getTableEnumText('port', this.state.startPort)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="目的港">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.destinationPort)
                        ? ''
                        : getTableEnumText('port', this.state.destinationPort)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {!isNil(this.state) && this.state.unloadingflag ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="卸货天数">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="天"
                    value={
                      isNil(this.state) || isNil(this.state.unloadingDays)
                        ? ''
                        : this.state.unloadingDays
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="装卸货量">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="%"
                    value={
                      isNil(this.state) || isNil(this.state.loadingUnloadingVolume)
                        ? ''
                        : this.state.loadingUnloadingVolume
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            : null}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="受载日期">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.loadDate) ? '' : moment(this.state.loadDate).format('YYYY/MM/DD')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="截止日期">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.endDate) ? '' : moment(this.state.endDate).format('YYYY/MM/DD')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...smallerFormItemLayout} label="联系方式">
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '22%', textAlign: 'center' }}
                    className="telinput"
                    disabled
                    value={isNil(this.state) || isNil(this.state.phoneCode) ? '' : this.state.phoneCode}
                  />
                </Form.Item>
              </Col>
              <Col span={8} {...smallFormItemLayout}>
                <Form.Item>
                  <Input
                    placeholder="手机号码"
                    style={{ marginLeft: '' }}
                    disabled
                    value={isNil(this.state) || isNil(this.state.contactPhone) ? '' : this.state.contactPhone}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="是否为重大件">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.majorParts)
                        ? ''
                        : this.state.majorParts
                    }
                  />
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
              {
                !isNil(this.state) && this.state.CGCG == 'G' ? (
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货物清单"></Form.Item>
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.pallet_add}
                      listType="picture-card"
                      accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                      headers={{ token: String(localStorage.getItem("token")) }}
                      showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.fileList) ||
                          this.state.fileList.length === 0
                          ? ''
                          : this.state.fileList
                      }
                      onPreview={this.handlePreview}
                    // onDownload={this.handleDownload}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.fileList) ||
                        this.state.fileList.length === 0
                        ? null
                        : null}
                    </Upload>
                  </Col>
                ):(
                  <Col span={12}>
                      <Form.Item {...formlayout} label="用户名">
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                          }
                        />
                      </Form.Item>
                  </Col>
                )
              }
              <Col span={12}>
                <Form.Item {...formlayout} label="意向价">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.intentionMoney) ? '' : this.state.intentionMoney
                    }
                  />
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={24}>
              <Col span={12}>
              </Col>
              <Col span={12}>
                <Form.Item {...smallFormItemLayout} label="备注">
                  <Input.TextArea readOnly disabled style={{width: '100%', height: '160px' }}
                    value={
                      isNil(this.state) || isNil(this.state.remark_1) ? '' : this.state.remark_1
                    }
                    />
                </Form.Item>
              </Col>
            </Row>


            <div className={commonCss.title}>
                <span className={commonCss.text}>其他服务</span>
            </div>
            <div style={{position:'absolute'}} >

            </div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要其他联合运输'>
                  {
                    !isNil(this.state) && this.state.unionTransport == '1' ? (
                        <Icon type="check-circle" theme="filled" />
                        ) : <Icon type="close-circle" />
                  }
                  <Input style={{ width:'40%',marginLeft:'30px' }}

                    onChange={e => this.setState({ lianheMoney: e.target.value})} />

                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要绑扎'>

                  {
                    !isNil(this.state) && this.state.isBind == '1' ? (
                        <Icon type="check-circle" theme="filled" />
                        ) : <Icon type="close-circle" />
                  }
                  <Input style={{ width:'40%',marginLeft:'30px' }}
                    onChange={e => this.setState({ bangzhaMoney: e.target.value})} />

                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
              {
                 !isNil(this.state) && this.state.CGCG == 'G'?(
                   <div>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='是否需集港'>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='港口操作'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ portOperation: e.target.value})} />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='港建费'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                        <Input style={{ width:'60%',marginLeft:'30px' }}

                        onChange={e => this.setState({ jiangangMoney: e.target.value})} />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='报关'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                          <Input style={{ width:'60%',marginLeft:'30px' }}
                              onChange={e => this.setState({ baoguanMoney: e.target.value})} />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='代理费'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ dailiMoney: e.target.value})} />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='理货费'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ lihuoMoney: e.target.value})} />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label='安保费'>
                        {
                            !isNil(this.state) && this.state.isGangji == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ anbaoMoney: e.target.value})} />
                        </Form.Item>
                      </Col>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要保险'>
                    <Col span={15}>
                        <Form.Item {...formlayout} label='卡车运输险'>
                          {
                            !isNil(this.state) && this.state.insuranceKache == '1' ? (
                                <Icon type="check-circle" theme="filled" />
                                ) : <Icon type="close-circle" />
                          }
                        <Input style={{ width:'60%',marginLeft:'30px' }}

                        onChange={e => this.setState({ kacheMoney: e.target.value})} />

                        </Form.Item>
                      </Col>
                    {
                      !isNil(this.state) && this.state.CGCG == 'G'?(
                        <Col span={15}>
                          <Form.Item {...formlayout} label='海运险'>
                          {
                              !isNil(this.state) && this.state.insuranceHaiyun == '1' ? (
                                  <Icon type="check-circle" theme="filled" />
                                  ) : <Icon type="close-circle" />
                            }
                            <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ haiyunMoney: e.target.value})} />
                          </Form.Item>
                        </Col>
                      ) : null
                    }
                    {
                      !isNil(this.state) && this.state.CGCG == 'C' ?(
                        <Col span={15}>
                          <Form.Item {...formlayout} label='江河海运险'>
                          {
                              !isNil(this.state) && this.state.insuranceJiangyun == '1' ? (
                                  <Icon type="check-circle" theme="filled" />
                                  ) : <Icon type="close-circle" />
                            }
                            <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ jianghaiyunMoney: e.target.value})} />

                          </Form.Item>
                        </Col>
                      ):null
                    }

                  </Form.Item>
                </Col>
                </div>
                 ):(
                  <Col span={12}>
                    <Form.Item {...formlayout} label='是否需要保险'>
                    {
                        !isNil(this.state) && this.state.CGCG == 'C' ?(
                          <Col span={15}>
                            <Form.Item {...formlayout} label='江河海运险'>
                            {
                                !isNil(this.state) && this.state.insuranceJiangyun == '1' ? (
                                    <Icon type="check-circle" theme="filled" />
                                    ) : <Icon type="close-circle" />
                              }
                              <Input style={{ width:'60%',marginLeft:'30px' }}

                              onChange={e => this.setState({ jianghaiyunMoney: e.target.value})} />

                            </Form.Item>
                          </Col>
                        ):null
                      }
                      <Col span={15}>
                          <Form.Item {...formlayout} label='卡车运输险'>
                            {
                              !isNil(this.state) && this.state.insuranceKache == '1' ? (
                                  <Icon type="check-circle" theme="filled" />
                                  ) : <Icon type="close-circle" />
                            }
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ kacheMoney: e.target.value})} />

                          </Form.Item>
                        </Col>
                      {
                        !isNil(this.state) && this.state.CGCG == 'G'?(
                          <Col span={15}>
                            <Form.Item {...formlayout} label='海运险'>
                            {
                                !isNil(this.state) && this.state.insuranceHaiyun == '1' ? (
                                    <Icon type="check-circle" theme="filled" />
                                    ) : <Icon type="close-circle" />
                              }
                              <Input style={{ width:'60%',marginLeft:'30px' }}

                              onChange={e => this.setState({ haiyunMoney: e.target.value})} />
                            </Form.Item>
                          </Col>
                        ) : null
                      }


                    </Form.Item>
                  </Col>
                 )
              }

                  <Col span={12}>
                      <Form.Item {...smallFormItemLayout} label="备注">
                        <Input.TextArea maxLength={255} style={{ width: '100%', height: '200px' }}
                        value={
                            isNil(this.state) || isNil(this.state.remarkk) ? '' : this.state.remarkk
                          }
                          onChange={e => this.setState({ remarkk: e.target.value })}
                          // onBlur={this.save}
                        />
                      </Form.Item>
                  </Col >

              </Row>


              <Row gutter={24}>
                <Form onSubmit={this.handleSubmit}>
                      {formItems}
                      <Form.Item {...formlayout}>
                        <Button type="dashed" onClick={this.add}>
                          <Icon type="plus" /> 添加自定义报价
                        </Button>
                      </Form.Item>
                    <Col span={16}>
                      <Form.Item {...formlayout}>
                        <Button type="primary" htmlType="submit" onClick={this.selectC} style={{width: '100%',backgroundColor:'#135A8D',color: '#FFFFFF',
                        }}>
                          提交
                        </Button>
                      </Form.Item>
                    </Col>
                </Form>
              </Row>
                <div style={{display:'flex'}}>
                    <h2>
                      货主价格建议
                    </h2>
                    {/* <h2 style={{marginLeft:'400px'}}>
                      自定义报价
                    </h2> */}
                </div>
                <div  style={{width:'1000px',height:'300px',display:'flex'}}>
                    <div style={{border: '1px solid #e8e8e8',borderRadius:'4px',overflow:'auto',padding:'8px 24px',height:'250px',width:'600px' }}>
                        <List
                          dataSource={isNil(this.state) || isNil(this.state.jianyi_1) ? '' : this.state.jianyi_1}
                          renderItem={item => (
                            <List.Item key={item.id}>
                              <List.Item.Meta
                                title={'海运费：'+item.haiyunRemark}
                                description={'其他服务费：'+item.haiyunRemark}
                              />
                              <div>{moment(item.createDate).format('YYYY/MM/DD')}</div>
                            </List.Item>
                          )}
                        >
                        </List>
                    </div>

                    {/* <div style={{border: '1px solid #e8e8e8',borderRadius:'4px',overflow:'auto',padding:'8px 24px',height:'250px',width:'500px',marginLeft:'50px' }}>
                      <List
                          dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '' : this.state.quotationDto_2}
                          renderItem={item => (
                            < List.Item >
                              <List.Item.Meta
                                title={item.quotationKefuOther.name+'：'}
                                // description={moment(item.createDate).format('YYYY/MM/DD')}
                              />
                              <div>
                                {
                                  item.content
                                }
                                </div>
                            </List.Item>
                          )}
                        >
                      </List>
                    </div> */}
                </div>

              <Row gutter={24}>
                <Col span={24}>
                  <HrComponent text="dashed" />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col>
                  <p style={{fontSize:'25px'}}>
                    报价记录
                  </p>
                </Col>
              </Row>
              {/* {
                <p>
                  {this.state.quotationDto_1}
                </p>
              } */}
                <List
                  itemLayout="vertical"
                  size="small"
                  pagination={{
                    onChange: page => {
                      console.log(page);
                    },
                    pageSize: 1,
                  }}
                  dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '': this.state.quotationDto_2}
                  renderItem={item => (
                    <List.Item>
                      <div key={item.guid}>
                          <h4>
                            {
                              moment(item.date).format('YYYY/MM/DD')
                            }
                          </h4>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                          <h3 style={{width:'400px'}}>
                            其他服务报价
                          </h3>
                          <h3 style={{width:'400px'}}>
                            自定义报价记录
                          </h3>
                          <h3 style={{width:'400px'}}>
                            备注
                          </h3>
                        </div>
                          <div style={{display:'flex',justifyContent:'space-between'}}>
                            <div style={{width:'400px', border: '1px solid #e8e8e8'}}>
                              <List
                                grid={{ column: 1 }}
                                dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '': item.quotationKefuOther}
                                renderItem={item => (
                                  <List.Item.Meta
                                  title={item.guid ? null : item.name +'：'+item.content}
                                  >
                                  </List.Item.Meta>
                                  )}
                                />
                            </div>
                            <div style={{overflow:'auto',height:'250px',border: '1px solid #e8e8e8', width:'400px'}}>
                              <List
                                  grid={{ column: 1 }}
                                  dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '' :item.quotationKefuOther}
                                  renderItem={item => (
                                    <div >
                                      {item.guid?(
                                        < List.Item >
                                          <List.Item.Meta
                                            title={item.guid ? item.name +'：'+item.content:null}
                                            // description={moment(item.createDate).format('YYYY/MM/DD')}
                                          />
                                        </List.Item>):null}
                                    </div>

                                  )}
                                >
                              </List>
                            </div>
                            <div style={{overflow:'auto',height:'250px',border: '1px solid #e8e8e8', width:'400px'}}>
                                {
                                  item.remark
                                }
                            </div>
                          </div>

                      </div>
                  </List.Item>
                  )}
                />
              {/* <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '': this.state.quotationDto_2}
                renderItem={item => (
                  <List.Item>
                            <div  >
                              <h4>
                                {
                                  moment(item.date).format('YYYY/MM/DD')
                                }
                              </h4>
                              <Card style={{height:'340px'}}>
                                <h3>
                                  其他服务报价
                                </h3>
                                <div style={{border: '1px solid #e8e8e8'}}>
                                  {

                                  }
                                  <List
                                  grid={{ column: 1 }}
                                  dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '': item.quotationKefuOther}
                                  renderItem={item => (
                                    <List.Item.Meta
                                    title={item.guid ? null : item.name +'：'+item.content}
                                    >
                                    </List.Item.Meta>
                                    )}
                                  />
                                </div>

                              </Card>

                              <Card  >
                                <h3>
                                  自定义报价记录
                                </h3>
                                <div style={{overflow:'auto',height:'250px',border: '1px solid #e8e8e8'}}>
                                  <List
                                      grid={{ column: 1 }}
                                      dataSource={isNil(this.state) || isNil(this.state.quotationDto_2) ? '' :item.quotationKefuOther}
                                      renderItem={item => (

                                        <div >
                                          {item.guid?(
                                            < List.Item >
                                              <List.Item.Meta
                                                title={item.guid ? item.name +'：'+item.content:null}
                                                // description={moment(item.createDate).format('YYYY/MM/DD')}
                                              />
                                            </List.Item>):null}
                                        </div>

                                      )}
                                    >
                                  </List>
                                </div>
                              </Card>
                            </div>
                  </List.Item>
                )}
              /> */}

              <div className={commonCss.title}>
                <span className={commonCss.text}>船东报价</span>
              </div>
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={isNil(this.state) || isNil(this.state.quotationDto) ? '' : this.state.quotationDto}
                renderItem={item => (
                  <List.Item>
                            <div>
                              <Card style={{  fontSize: '18px'}}>
                                {
                                  <div style={{marginLeft: '80%', fontSize:'13px'}}>
                                    {moment(item.createDate).format('YYYY/MM/DD')}
                                  </div>
                                }
                                {
                                  <span style={ { color: 'red', fontSize: '18px'}}>
                                    {!isNil(this.state) && this.state.CGCG == 'G'?(
                                      '海运费：'+(item.oceanFreight?item.currency === 0 ?'$'+item.oceanFreight+'USD':item.currency === 2?'€'+item.oceanFreight+'EURO':'￥'+item.oceanFreight+'RMB':null)
                                    ):(
                                      '航运费：'+(item.insertFlag === 1 ?'￥'+item.turnkeyProject+'元' : item.tonnage === ''?'' :'￥'+item.tonnage+'元/吨')
                                    )}
                                  </span>
                                }
                                <br/>
                                <br />
                                {
                                  <span style={{ fontSize:'15px'}}>
                                    {!isNil(this.state) && this.state.CGCG == 'G'?(
                                      '计费方式：'+ (item.chargeMode ? item.chargeMode === 0 ? 'Per.MT' : item.chargeMode === 1 ? 'Per. W/M' : item.chargeMode === 2 ?'Per.CBM' : null:null)
                                      ):(
                                      '计费方式：'+(item.insertFlag === 1 ?'总包干价' : '按吨计费')
                                    )}
                                  </span>
                                }
                                <br/>
                                <br />
                                {
                                  <span style={{ fontSize:'15px'}}>
                                    {!isNil(this.state) && this.state.CGCG === 'G'?(
                                      '运费条款：'+(item.freightClause === 0 ? 'FILO': item.freightClause === 1 ? 'FLT' : item.freightClause === 2 ? 'LIFO' : item.freightClause === 3 ? 'FIO' : item.freightClause === 4 ? 'FIOST':null)
                                    ):null}
                                  </span>
                                }
                                <br/>
                                {
                                  <span style={{ fontSize:'15px'}}>
                                    {!isNil(this.state) && this.state.CGCG == 'G'?(
                                      '佣金'+('Add.com'+(isNil(this.state) || isNil(this.state.addCommission) ? '无佣金' : this.state.addCommission)+'+'+'com'+(isNil(this.state) || isNil(this.state.commission) ? '无佣金' : this.state.commission))
                                    ):null}
                                  </span>
                                }
                              </Card>


                            </div>
                  </List.Item>
                )}
              />


            {/* <Row gutter={24}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row> */}
              <div className={commonCss.title}>
                <span className={commonCss.text}>备注</span>
              </div>
            <Row gutter={24}>
              <Col>
                <Form.Item {...smallFormItemLayout} label="备注">
                  <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                  value={
                      isNil(this.state) || isNil(this.state.remarkTwo) ? '' : this.state.remarkTwo
                    }
                    onChange={e => this.setState({ remark: e.target.value })}
                    onBlur={this.save}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text="关闭"
                  event={() => {
                    this.onBack();
                  }}
                />
              </Col>
              <Col span={12}></Col>
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
      </div >
    );
  }
}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
