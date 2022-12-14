import { getRequest, postRequest, putRequest } from '@/utils/request';
import { Col, DatePicker, Form, Icon, Input, message, Modal, Radio, Row, Upload } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { IIProps, IState, Model } from './CertificationProps';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';

//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');
//审核中图片
const oncheck = require('../../Image/onCheck.png');
const oncheckEN = require('../../Image/onCheckEN.png');
//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');
const { TextArea } = Input;
type IProps = IIProps & RouteComponentProps;
class UserAuth extends React.Component<IProps, IState> {
  constructor(prop: IProps) {
    super(prop);
  }

  state = {
    previewVisible: false,
    previewImage_1: '',
    imgList: [],
    fileName1: '',
    OK: false,
    COK: false,
  };

  componentDidMount = () => {
    const selStatus = isNil(this.props.match.params['selstatus']) ? '1' : this.props.match.params['selstatus'];
    let userId = isNil(this.props.match.params['id'])
      ? localStorage.getItem('userId')
      : this.props.match.params['id'];
    this.setState({
      userId: userId,
      userType: localStorage.getItem('userType'),
      selStatus: selStatus,
      businessLicenseflag: false,
      securitySmcflag: false,
      // rentShipContractflag: false,
      securityDoc: false,
      visible: false,
      imgList: [],
    });
    let param: Map<string, string> = new Map();
    // 资料详情查看type为1
    param.set('type', '1');
    param.set('userId', userId);
    getRequest('/sys/userDetail/' + userId, param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let pic = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
          if (response.data.userDetail.checkStatus === 2) {
            (pic = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN);
          } else if (response.data.userDetail.checkStatus === 1) {
            pic = getLocale() === 'zh-CN' ? oncheck : oncheckEN;
          }

          let PL = response.data.files;
          forEach(PL,(filname) => {
            console.log(filname)
            if(filname.fileLog == 1){
              this.setState({
                YYZZ:`http://58.33.34.10:10443/images/user/`+filname.fileName//营业执照
              })
            }else if(filname.fileLog == 7){
              this.setState({
                SMC:`http://58.33.34.10:10443/images/shiptrade/`+filname.fileName//船舶安全管理证书 SMC
              })
            }else if(filname.fileLog == 6){
              this.setState({
                DOC:`http://58.33.34.10:10443/images/user/`+filname.fileName//船公司安全管理符合证明 DOC
              })
            }else{

            }
          });
          console.log(this.state.YYZZ)
          console.log(this.state.ZCHT)
          console.log(this.state.CDHPZS)

          this.setState({
            certificationPic: pic,
            guid: response.data.userDetail.guid,
            //公司名称
            companyName: response.data.userDetail.companyName,
            //公司电话
            phoneNumber: response.data.userDetail.phoneNumber,
            //传真号
            faxNumber: response.data.userDetail.faxNumber,
            //银行名称及开户行
            bankType: response.data.userDetail.bankType,
            //银行账号
            bankNumber: response.data.userDetail.bankNumber,
            //审核意见
            checkRemark: response.data.userDetail.checkRemark,
            //地址
            companyAddress: response.data.userDetail.companyAddress,
            securityDocEndTime: response.data.userDetail.docEndTime,
            securitySmcEndTime: response.data.userDetail.smcEndTime,
            checkStatus: response.data.userDetail.checkStatus,
            ownerType: response.data.userDetail.ownerType,
            photoList: response.data.files,
          });

          if (
            (localStorage.getItem('userType') !== '3' &&
              response.data.userDetail.checkStatus !== 0) ||
            (localStorage.getItem('userType') === '3' &&
              (response.data.userDetail.checkStatus === 2 ||
                response.data.userDetail.checkStatus === 3))
          ) {
            this.setState({
              isIndex: true,
            })
          }
          console.log(this.state.isIndex);
          forEach(response.data.files, (photo, index) => {
            if (!isNil(photo.fileName) && !isNil(photo.fileType)) {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', photo.fileName);
              // getRequest(
              //   '/sys/file/getThumbImageBase64/'+ pic.fileType,
              //   picParams,
                // (response: any) => {
                //   if (response.status === 200) {
                //     if (photo.fileLog === 1) {
                //       this.setState({
                //         businessLicenseFileList: [
                //           {
                //             uid: index,
                //             // name: response.data[0].fileName,
                //             status: 'done',
                //             thumbUrl: response.data[0].base64,
                //             fileType: photo.fileType,
                //             fileName: photo.fileName,
                //           },
                //         ],
                //         businessLicenseFileName: response.data[0].fileName,
                //         businessLicenseFileType: photo.fileType,
                //       });
                //     } else if (photo.fileLog === 7) {
                //       this.setState({
                //         securitySmcFileList: [
                //           {
                //             uid: index,
                //             // name: response.data[0].fileName,
                //             status: 'done',
                //             thumbUrl: response.data[0].base64,
                //             fileType: photo.fileType,
                //             fileName: photo.fileName,
                //           },
                //         ],
                //         securitySmcFileName: response.data[0].fileName,
                //         securitySmcFileType: photo.fileType,
                //       });
                //     } else if (photo.fileLog === 6) {
                //       this.setState({
                //         securityDocFileList: [
                //           {
                //             uid: index,
                //             name: response.data[0].fileName,
                //             status: 'done',
                //             thumbUrl: response.data[0].base64,
                //             fileType: photo.fileType,
                //             fileName: photo.fileName,
                //           },
                //         ],
                //         securityDocFileName: response.data[0].fileName,
                //         securityDocFileType: photo.fileType,
                //       });
                //     // } else if (photo.fileLog === 9) {
                //     //   this.setState({
                //     //     rentShipContractFileList: [
                //     //       {
                //     //         uid: index,
                //     //         name: response.data[0].fileName,
                //     //         status: 'done',
                //     //         thumbUrl: response.data[0].base64,
                //     //         fileType: photo.fileType,
                //     //         fileName: photo.fileName,
                //     //       },
                //     //     ],
                //     //     rentShipContractFileName: response.data[0].fileName,
                //     //     rentShipContractFileType: photo.fileType,
                //     //   });
                //     }
                //   }
                // },
              // );
            }
          });
        } else {
          this.setState({
            checkStatus: 0,
            ownerType: 0,
          });
        }
      }
    });
  };

  handleSubmit = (flag: number) => {
    const picList: Model[] = [];
    console.log(flag)
    this.props.form.validateFields((err: any) => {
      if (!isNil(this.state.businessLicenseFileName)) {
        let pic = {
          fileName: this.state.businessLicenseFileName,
          fileType: this.state.businessLicenseFileType,
          fileLog: 1,
        };
        picList.push(pic);
      }
      if (!isNil(this.state.securityDocFileName)) {
        let pic = {
          fileName: this.state.securityDocFileName,
          fileType: this.state.securityDocFileType,
          fileLog: 6,
        };
        picList.push(pic);
      }
      if (!isNil(this.state.securitySmcFileName)) {
        let pic = {
          fileName: this.state.securitySmcFileName,
          fileType: this.state.securitySmcFileType,
          fileLog: 7,
        };
        picList.push(pic);
      }
      console.log(picList+'picList')
      // if (!isNil(this.state.rentShipContractFileName)) {
      //   let pic = {
      //     fileName: this.state.rentShipContractFileName,
      //     fileType: this.state.rentShipContractFileType,
      //     fileLog: 9,
      //   };
      //   picList.push(pic);
      // }
      if (!err) {
        console.log(123456789)
        const userType = localStorage.getItem('userType');
        if (userType !== '3') {
          let requestData = {
            guid: this.state.guid,
            userId: this.state.userId,
            ownerType: localStorage.getItem('userType') === '4' ? 2 : this.state.ownerType,
            companyName: this.state.companyName,//公司名称
            phoneNumber: this.state.phoneNumber,//公司电话
            faxNumber: this.state.faxNumber,//传真号
            companyAddress: this.state.companyAddress,//地址
            bankType: this.state.bankType,  //银行名称及开户行
            bankNumber: this.state.bankNumber,//银行账号
            state: flag,
            fileUpLoadVos: picList,
          };
          console.log(requestData)
          // 新增保存请求
          postRequest('/sys/userDetail/data', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/index');
            }
          });
        }
      }
    });
  };

//货主端认证   带有_1
  handleSubmit_1=(flag: number)=>{
    let A = this.state.fileName1
    let picList =[{
      fileName : A,
      fileType: 'user',
      fileLog: 1,
    }]
    let requestData = {
      guid: this.state.guid,
      userId: this.state.userId,
      ownerType: localStorage.getItem('userType') === '4' ? 2 : this.state.ownerType,
      companyName: this.state.companyName,//公司名称
      phoneNumber: this.state.phoneNumber,//公司电话
      faxNumber: this.state.faxNumber,//传真号
      companyAddress: this.state.companyAddress,//地址
      bankType: this.state.bankType,  //银行名称及开户行
      bankNumber: this.state.bankNumber,//银行账号
      state: flag,
      fileUpLoadVos: picList,
    };
    console.log(requestData)
    // 新增保存请求
    postRequest('/sys/userDetail/data', JSON.stringify(requestData), (response: any) => {
      if (response.status === 200) {
        // 跳转首页
        console.log('成功')
        this.props.history.push('/index');
      }
    });
  }






  handleChange_1 = ({ file, fileList,event }) => {
    // console.log(file); // file 是当前正在上传的 单个 img
    // console.log(fileList[0].response); // fileList 是已上传的全部 img 列表
    console.log(file)
    console.log(fileList)
    console.log(event)
    if(file.response) {
      let a = file.response.data.fileName
      console.log(a)
      this.setState({
        fileName1: a,
      });

    }else{
      console.log(event)
    };
    this.setState({
      imgList: fileList,
    });
  };

  handlePreview_1 = file => {
    this.setState({
      previewImage_1: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };


  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // 图片预览
  handlePreview = (type: string, file: any) => {
    let fileType;
    let params: Map<string, string> = new Map();
    if (file.response) {
      params.set('fileName', file.response.data.fileName);
      fileType = file.response.data.type;
    } else {
      params.set('fileName', file.fileName);
      fileType = file.fileType
    }
    getRequest('/sys/file/getImageBase64/' + fileType, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };

  //删除图片
  onRemove = (type: string, file: any) => {
    if (type === 'businessLicense') {
      this.setState(() => ({
        businessLicenseFileList: [],
      }));
    } else if (type === 'securityDoc') {
      this.setState(() => ({
        securityDocFileList: [],
      }));
    } else if (type === 'securitySmc') {
      this.setState(() => ({
        securitySmcFileList: [],
      }));
    // } else {
    //   this.setState(() => ({
    //     rentShipContractFileList: [],
    //   }));
    }
  };

  checkInputRemark = (rule: any, val: any, callback: any) => {
    if (localStorage.getItem('userType') === '3') {
      if (isNil(val) || val === '') {
        callback('审批意见不能为空!');
      } else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  //判断过期时间
  checkEndtimePick = (type: string, rule: any, val: any, callback: any) => {
    if (localStorage.getItem('userType') === '3') {
      if (this.state.ownerType === 0 || this.state.ownerType === 1) {
        if (type === 'Doc') {
          if (isNil(val)) {
            callback('doc到期时间不能为空');
          } else {
            const nextMonthDate = moment(new Date())
              .add('months', 1)
              .format('YYYY/MM/DD');
            const date = moment(val).format('YYYY/MM/DD');
            if (moment(date).isBefore(nextMonthDate)) {
              callback('到期日期1个月内无效!');
            } else {
              callback();
            }
          }
        }
        if (type === 'Smc') {
          if (isNil(val)) {
            callback('smc到期时间不能为空');
          } else {
            const nextMonthDate = moment(new Date())
              .add('months', 1)
              .format('YYYY/MM/DD');
            const date = moment(val).format('YYYY/MM/DD');
            if (moment(date).isBefore(nextMonthDate)) {
              callback('到期日期1个月内无效!');
            } else {
              callback();
            }
          }
        }
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  // 检查图片是否上传
  checkFile = (type: string, rule: any, val: any, callback: any) => {
    const userType = localStorage.getItem('userType');
    if (type === 'businessLicense') {
      if (
        isNil(this.state.businessLicenseFileList) ||
        this.state.businessLicenseFileList.length === 0
      ) {
        callback(formatMessage({ id: 'CertificationReview-CertificationIndex.picutre.null' }));//营业执照图片不能为空
      } else {
        callback();
      }
    } else if (type === 'securityDoc') {
      if (
        this.state.ownerType.toString() !== '2' &&
        userType !== '4' &&
        (isNil(this.state.securityDocFileList) ||
          this.state.securityDocFileList.length === 0)
      ) {
        callback(
          formatMessage({ id: 'CertificationReview-CertificationIndex.shipcompany.certify.null' }),//船公司安全管理符合证明 DOC不能为空！',
        );
      } else {
        callback();
      }
    } else if (type === 'securitySmc') {
      if (
        this.state.ownerType.toString() !== '2' &&
        userType !== '4' &&
        (isNil(this.state.securitySmcFileList) || this.state.securitySmcFileList.length === 0)
      ) {
        callback(formatMessage({ id: 'CertificationReview-CertificationIndex.smc.null' }));//船舶安全管理证书 SMC不能为空
      } else {
        callback();
      }
    // } else {
    //   if (
    //     this.state.ownerType.toString() === '1' &&
    //     (isNil(this.state.rentShipContractFileList) ||
    //       this.state.rentShipContractFileList.length === 0)
    //   ) {
    //     callback(formatMessage({ id: 'CertificationReview-CertificationIndex.contract.null' }));
    //   } else {
    //     callback();
    //   }
    }
  };

  //上传图片变更
  handleChange = (type: string, { fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      if (type === 'businessLicense') {
        this.setState({
          businessLicenseflag: true,
        });
      } else if (type === 'securityDoc') {
        this.setState({
          securityDoc: true,
        });
        1
      } else if (type === 'securitySmc') {
        this.setState({
          securitySmcflag: true,
        });
      // } else {
      //   this.setState({
      //     rentShipContractflag: true,
      //   });
      }
      forEach(fileList, file => {
        if (file.status === 'done') {
          if (file.response.status === 200) {
            if (type === 'businessLicense') {
              this.setState({
                businessLicenseFileType: file.response.data.type,
                businessLicenseFileName: file.response.data.fileName,
                businessLicenseflag: false,
              });
            } else if (type === 'securityDoc') {
              this.setState({
                securityDocFileType: file.response.data.type,
                securityDocFileName: file.response.data.fileName,
                securityDoc: false,
              });
              1
            } else if (type === 'securitySmc') {
              this.setState({
                securitySmcFileType: file.response.data.type,
                securitySmcFileName: file.response.data.fileName,
                securitySmcflag: false,
              });
            // } else {
            //   this.setState({
            //     rentShipContractFileType: file.response.data.type,
            //     rentShipContractFileName: file.response.data.fileName,
            //     rentShipContractflag: false,
            //   });
            }
          }
        }
        if (type === 'businessLicense') {
          this.setState({ businessLicenseFileList: fileList });
        } else if (type === 'securityDoc') {
          this.setState({ securityDocFileList: fileList });
        } else if (type === 'securitySmc') {
          this.setState({ securitySmcFileList: fileList });
        // } else {
        //   this.setState({ rentShipContractFileList: fileList });
        }
      });
    }
  };

  //Smc日期选择
  handleSecuritySmcEndTime = (value: any, dateString: any) => {
    this.setState({
      securitySmcEndTime: value,
    });
  };
  //Doc日期选择
  securityDocEndTime = (value: any, dateString: any) => {
    this.setState({
      securityDocEndTime: value,
    });
  };

  //返回事件
  onBack = () => {
    if (this.state.userType === '3') {
      this.props.history.push('/usercertification' + '?selectTab=' + this.state.selStatus);
    } else {
      this.props.history.push('/index_menu');
    }
  };

  uploadAgain = () => {
    this.setState({
      isIndex: false,
    })
  };

  // 驳回或审批通过
  turnDown = (value: number) => {
    if (value === 2) {
      this.props.form.validateFields(['securityDocEndTime', 'securitySmcEndTime'], (err: any, values: any) => {
        if (!err) {
          const requestData = {
            guid: this.state.guid,
            checkStatus: value,
            checkRemark: this.state.checkRemark,
            docEndTime: isNil(this.state.securityDocEndTime)
              ? null
              : Number(this.state.securityDocEndTime),
            smcEndTime: isNil(this.state.securitySmcEndTime)
              ? null
              : Number(this.state.securitySmcEndTime),
          };
          // 资料认证审批
          putRequest('/sys/userDetail/review', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/usercertification/list');
              {
                value === 2 ? message.success('审批通过') : message.success('驳回成功');
              }
            }
          });
        }
      });
    } else {
      this.props.form.validateFields(['checkRemark'], (err: any, values: any) => {
        if (!err) {
          const requestData = {
            guid: this.state.guid,
            checkStatus: value,
            checkRemark: this.state.checkRemark,
            docEndTime: isNil(this.state.securityDocEndTime)
              ? null
              : Number(this.state.securityDocEndTime),
            smcEndTime: isNil(this.state.securitySmcEndTime)
              ? null
              : Number(this.state.securitySmcEndTime),
          };
          // 资料认证审批
          putRequest('/sys/userDetail/review', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/usercertification/list');
              {
                value === 2 ? message.success('审批通过') : message.success('驳回成功');
              }
            }
          });
        }
      });
    }
  };

  //图片放大
  showModal = (a) => {
    this.setState({
      visible: true,
    });
    this.setState({
      bigImg:a
    })
  };
  handleOk = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const labellayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 0 },
    };
    const piclayout = {
      wrapperCol: { span: 24 },
    };
    const { previewVisible, previewImage_1, imgList } = this.state; //  从 state 中拿数据
    const { getFieldDecorator } = this.props.form;
    const userType = isNil(this.state) || isNil(this.state.userType) ? '' : this.state.userType;
    const checkStatus =
      isNil(this.state) || isNil(this.state.checkStatus) ? 0 : this.state.checkStatus;
    const ownerType = isNil(this.state) || isNil(this.state.ownerType) ? 0 : this.state.ownerType;
    const isIndex = isNil(this.state) || isNil(this.state.isIndex) ? false : this.state.isIndex;

    //营业执照过期时间
    const checkEndTime = (
      <Col span={9} style = {{paddingTop:'30px'}}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('businessLicenseEndTime', {
            initialValue: formatMessage({
              id: 'CertificationReview-CertificationIndex.userforever',
            }),
          })(
            <Input
              disabled={true}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //Doc过期时间
    const docEndTime = (
      <Col span={9} style = {{paddingTop:'30px'}}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('securityDocEndTime', {
            initialValue:
              isNil(this.state) ||
                isNil(this.state.securityDocEndTime) ||
                this.state.securityDocEndTime === ''
                ? undefined
                : moment(Number(this.state.securityDocEndTime)),
            rules: [
              {
                validator: this.checkEndtimePick.bind(this, 'Doc'),
              },
            ],
          })(
            <DatePicker
              disabled={isIndex}
              locale={getLocale()}
              format={'YYYY/MM/DD'}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
              onChange={this.securityDocEndTime}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //Smc过期时间
    const smcEndTime = (
      <Col span={9} style = {{paddingTop:'30px'}}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('securitySmcEndTime', {
            initialValue:
              isNil(this.state) ||
                isNil(this.state.securitySmcEndTime) ||
                this.state.securitySmcEndTime === ''
                ? undefined
                : moment(Number(this.state.securitySmcEndTime)),
            rules: [
              {
                validator: this.checkEndtimePick.bind(this, 'Smc'),
              },
            ],
          })(
            <DatePicker
              disabled={isIndex}
              locale={getLocale()}
              format={'YYYY/MM/DD'}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
              onChange={this.handleSecuritySmcEndTime}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //营业执照
    const check = (
          <Col span={3}>
            <Form.Item {...piclayout} label="">
              {getFieldDecorator(`businessLicense`, {
                rules: [
                  {
                    validator: this.checkFile.bind(this, 'businessLicense'),
                  },
                ],
              })(
                <img  src={isNil(this.state) || isNil(this.state.YYZZ) ? '' : this.state.YYZZ}
                      alt=""
                      style={{ width: '70%' }}
                      onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.YYZZ) ? '' :  this.state.YYZZ) }}
                />
                )}
                {/* {uploadButton} */}
                {/* {
                  ownerType === 0 ?{}:null;
                } */}
            </Form.Item>
          </Col>
    );


    //上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          {/* 上传图片 */}
          <FormattedMessage id="CertificationReview-CertificationIndex.upload.picture" />
        </div>
      </div>
    );

    //营业执照上传
    const checkUP = (
      <Col span={8}>
        <Form.Item {...piclayout} label="">
          <Upload
            action="/api/sys/file/upload"
            listType="picture-card"
            data={{ type: 1 }}
            headers={{ token: String(localStorage.getItem('token')) }}
            showUploadList={{
              showPreviewIcon: true,
              showDownloadIcon: false,
              showRemoveIcon: false,
            }}
            fileList={this.state.imgList}
            onPreview={this.handlePreview_1}
            onChange={this.handleChange_1}
          >
           {/* {this.state.businessLicenseFileList.length >= 1 ? null : uploadButton} */}
           {/* {uploadButton} */}
           {this.state.imgList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
      </Col>
    );


    //租船合同
    // const rentShip = (
    //   <Col span={8}>
    //     <Form.Item {...piclayout} label="">
    //       {getFieldDecorator(`rentShipContract`, {
    //         rules: [
    //           {
    //             validator: this.checkFile.bind(this, 'rentShipContract'),
    //           },
    //         ],
    //       })(
    //         <Upload
    //           action="/api/sys/file/upload/user"
    //           listType="picture-card"
    //           accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
    //           headers={{ token: String(localStorage.getItem('token')) }}
    //           onRemove={this.onRemove.bind(this, 'rentShipContract')}
    //           onPreview={this.handlePreview.bind(this, 'rentShipContract')}
    //           onChange={this.handleChange.bind(this, 'rentShipContract')}
    //           showUploadList={{
    //             showPreviewIcon: true,
    //             showDownloadIcon: false,
    //             showRemoveIcon: userType === '3' || isIndex ? false : true,
    //           }}
    //           fileList={
    //             isNil(this.state) ||
    //               isNil(this.state.rentShipContractFileList) ||
    //               this.state.rentShipContractFileList.length === 0
    //               ? ''
    //               : this.state.rentShipContractFileList
    //           }
    //         >
    //           {isNil(this.state) ||
    //             isNil(this.state.rentShipContractFileList) ||
    //             this.state.rentShipContractFileList.length === 0
    //             ? uploadButton
    //             : null}
    //         </Upload>,
    //       )}
    //     </Form.Item>
    //   </Col>
    // );
    //doc
    const doc = (
      <Col span={3}>
        <Form.Item {...piclayout} label="">
          {getFieldDecorator(`securityDoc`, {
            rules: [
              {
                validator: this.checkFile.bind(this, 'securityDoc'),
              },
            ],
          })(
            <img  src={isNil(this.state) || isNil(this.state.DOC) ? '' : this.state.DOC}
                alt=""
                style={{ width: '70%' }}
                onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.DOC) ? '' :  this.state.DOC) }}
             />
          )}
        </Form.Item>
      </Col>
    );
    //smc
    const smc = (
      <Col span={3}>
        <Form.Item {...piclayout} label="">
          {getFieldDecorator(`securitySmc`, {
            rules: [
              {
                validator: this.checkFile.bind(this, 'securitySmc'),
              },
            ],
          })(
            <img  src={isNil(this.state) || isNil(this.state.SMC) ? '' : this.state.SMC}
            alt=""
            style={{ width: '70%' }}
            onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.SMC) ? '' :  this.state.SMC) }}
         />
          )}
        </Form.Item>
      </Col>
    );

    const process = (<div className={commonCss.container}>
      <LabelTitleComponent
        text={formatMessage({
          id: 'CertificationReview-CertificationIndex.profile.certification',
        })}
        event={() => {
          this.onBack();
        }}
      />
      <div className={commonCss.AddForm}>
        <Form labelAlign="left">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item>
                {ownerType === 0 ? (
                  <span style={{ color: 'red' }}>
                    {/* //我是自有船东(管理公司) */}
                    <FormattedMessage id="CertificationReview-CertificationIndex.shipowner" />
                  </span>
                ) : ownerType === 1 ? (
                  <span style={{ color: 'red' }}>
                    {/* 我是二船东 */}
                    <FormattedMessage id="CertificationReview-CertificationIndex.owner.two" />
                  </span>
                ) : null}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                label={formatMessage({ id: 'CertificationReview-CertificationIndex.company' })}//公司名称'
              >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.companyName)
                      ? ''
                      : this.state.companyName
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.phonenumber',//电话号码
                })}
              >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.phoneNumber)
                      ? ''
                      : this.state.phoneNumber
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                label={formatMessage({ id: 'CertificationReview-CertificationIndex.address' })}//地址
              >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.companyAddress)
                      ? ''
                      : this.state.companyAddress
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.deposit.bank',//开户行
                })}
              >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.bankType) ? '' : this.state.bankType
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.bank.account',//银行账号
                })}
              >
                <Input
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.bankNumber)
                      ? ''
                      : this.state.bankNumber
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {' '}
              <Form.Item
                {...labellayout}
                required
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.business.license',//营业执照
                })}
              ></Form.Item>
            </Col>
            {ownerType === 1 ? (
              <Col span={12}>
                {' '}
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}//船公司安全管理符合证明 DOC
                ></Form.Item>
              </Col>
            ) : null}
            {ownerType === 0 ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}//船公司安全管理符合证明 DOC
                >
                  {' '}
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          <Row gutter={24}>
            {check}
            {userType === '3' ? checkEndTime : <Col span={9}></Col>}

            {ownerType === 0 || ownerType === 1 ? doc : null}
            {userType === '3' && (ownerType === 0 || ownerType === 1) ? docEndTime : <Col span={9}></Col>}
          </Row>

          {/* <Row gutter={24}>
            {ownerType === 1 ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}//船舶安全管理证书 SMC',
                ></Form.Item>
              </Col>
            ) : null}
            {ownerType === 0 ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}//'船舶安全管理证书 SMC'
                ></Form.Item>
              </Col>
            ) : null}
          </Row> */}

          {/* <Row gutter={24}>
            {ownerType === 1 || ownerType === 0 ? smc : null}
            {userType === '3' && (ownerType === 1 || ownerType === 0) ? smcEndTime : <Col span={9}></Col>}
          </Row> */}
          {!isNil(this.state) && !isNil(this.state.checkRemark) ? (
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item
                  {...piclayout}
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.approval.opinion',
                  })}
                >
                  <TextArea
                    style={{ width: '100%', border: 'none' }}
                    value={
                      isNil(this.state) || isNil(this.state.checkRemark)
                        ? ''
                        : this.state.checkRemark
                    }
                    rows={4}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>) : <Row gutter={24} style={{ height: '120px' }}></Row>}
        </Form>
        <Form labelAlign="left">
          <Row className={commonCss.rowTop}>
            {userType !== '3' && checkStatus === 3 ? (
              <Col span={8} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.close' })}
                  event={() => {
                    this.onBack();
                  }}
                  disabled={!isNil(this.state) && (this.state.businessLicenseflag || this.state.securitySmcflag || this.state.securityDoc)} //|| this.state.rentShipContractflag
                />
              </Col>
            ) : (<Col span={8}>
            </Col>)}
            {userType !== '3' && checkStatus === 3 ? (
              <Col span={8}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({
                    id: 'CertificationReview-CertificationIndex.upload.again',//重新上传认证
                  })}
                  event={() => {
                    this.uploadAgain();
                  }}
                />
              </Col>
            ) : (<Col span={8}>
              <ButtonOptionComponent
                type="Approve"
                text={formatMessage({ id: 'CertificationReview-CertificationIndex.close' })}//关闭
                event={() => {
                  this.onBack();
                }}
              />
            </Col>
              )}
            <Col span={2}></Col>
            <Col span={5}>
              <div className={commonCss.picTopAndBottom}>
                <img
                  style={{ marginTop: '-50%' }}
                  src={
                    isNil(this.state) || isNil(this.state.certificationPic)
                      ? ''
                      : this.state.certificationPic
                  }
                  className={commonCss.imgWidth}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      {/* <Modal className="picModal"
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
      </Modal> */}
    </div>)



    const index = (<div className={commonCss.container}>
      <LabelTitleComponent
        text={formatMessage({
          id: 'CertificationReview-CertificationIndex.profile.certification',
        })}
        event={() => this.onBack()}
      />

      <Modal
        title=""
        visible={isNil(this.state) || isNil(this.state.visible) ? '' : this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <img src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg} alt="" style={{ width: '90%' }}/>
        {/* <img src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)} alt="" style={{ width: '60%' }}/> */}
        {/* isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName) */}
      </Modal>

      <div className={commonCss.AddForm}>
        <Form labelAlign="left">
          {userType === '4' ? null : (
            <Row gutter={24}>
              <Col span={10}>
                <Form.Item>
                  {userType === '3' ? (
                    ownerType === 2 ? null : ownerType === 0 ? (
                      <span style={{ color: 'red' }}>
                        {/* 我是自有船东(管理公司) */}
                        <FormattedMessage id="CertificationReview-CertificationIndex.shipowner" />
                      </span>
                    ) : (
                        <span style={{ color: 'red' }}>
                          {/* 我是二船东 */}
                          <FormattedMessage id="CertificationReview-CertificationIndex.owner.two" />
                        </span>
                      )
                  ) : null}
                  {userType === '5' ? (
                    <Radio.Group
                      name="radiogroup"
                      onChange={e => this.setState({ ownerType: e.target.value })}
                    >
                      <Radio
                        checked={ownerType === 0}
                        style={{ color: 'red', fontSize: 'small' }}
                        value={0}
                      >
                        {/* //我是自有船东(管理公司) */}
                        <FormattedMessage id="CertificationReview-CertificationIndex.shipowner" />
                      </Radio>
                      <Radio
                        checked={ownerType === 1}
                        style={{ color: 'red', fontSize: 'small' }}
                        value={1}
                      >
                        {/* 我是二船东 */}
                        <FormattedMessage id="CertificationReview-CertificationIndex.owner.two" />
                      </Radio>
                    </Radio.Group>
                  ) : null}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                required
                label={formatMessage({ id: 'CertificationReview-CertificationIndex.company' })}//公司名称
              >
                {getFieldDecorator('companyName', {
                  initialValue:
                    this.state == null || this.state.companyName == null
                      ? ''
                      : this.state.companyName,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'CertificationReview-CertificationIndex.company.must',//公司名称不能为空！
                      }),
                    },
                  ],
                })(
                  <Input
                    disabled={userType === '3' ? true : false}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.company.enter',//请输入您的公司名称
                    })}
                    onChange={e => this.setState({ companyName: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                required
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.phonenumber',//电话号码
                })}
              >
                {getFieldDecorator('companyTelephone', {
                  initialValue:
                    this.state == null || this.state.phoneNumber == null
                      ? ''
                      : this.state.phoneNumber,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'CertificationReview-CertificationIndex.phonenumber.must',//电话号码不能为空
                      }),
                    }
                  ],
                })(
                  <Input
                    maxLength={20}
                    disabled={userType === '3' ? true : false}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.phonenumber.enter',//请输入您的电话号码
                    })}
                    onChange={e => this.setState({ phoneNumber: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                required
                label={formatMessage({ id: 'CertificationReview-CertificationIndex.address' })}//地址
              >
                {getFieldDecorator('companyAddress', {
                  initialValue:
                    this.state == null || this.state.companyAddress == null
                      ? ''
                      : this.state.companyAddress,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'CertificationReview-CertificationIndex.address.must',//地址不能为空
                      }),
                    },
                  ],
                })(
                  <Input
                    maxLength={64}
                    disabled={userType === '3' ? true : false}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.address.input',//请输入您的地址
                    })}
                    onChange={e => this.setState({ companyAddress: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                required
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.deposit.bank',//开户行
                })}
              >
                {getFieldDecorator('bankType', {
                  initialValue:
                    this.state == null || this.state.bankType == null ? '' : this.state.bankType,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'CertificationReview-CertificationIndex.deposit.bank.must',//开户行不能为空
                      }),
                    },
                  ],
                })(
                  <Input
                    maxLength={50}
                    disabled={userType === '3' ? true : false}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.deposit.bank.input',//请输入您的开户行
                    })}
                    onChange={e => this.setState({ bankType: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                {...formlayout}
                required
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.bank.account',//银行账号
                })}
              >
                {getFieldDecorator('bankNumber', {
                  initialValue:
                    this.state == null || this.state.bankNumber == null
                      ? ''
                      : this.state.bankNumber,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'CertificationReview-CertificationIndex.bank.account.must',//银行账号不能为空
                      }),
                    },
                    {
                      pattern: new RegExp(/^[0-9]\d*$/),
                      message: formatMessage({ id: 'user-login.login.pls-input-number' }),//'请输入正确的数值！
                    },
                  ],
                })(
                  <Input
                    maxLength={20}
                    disabled={userType === '3' ? true : false}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.bank.account.input',//请输入您的银行账号
                    })}
                    onChange={e => this.setState({ bankNumber: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {' '}
              <Form.Item
                {...labellayout}
                required
                label={formatMessage({
                  id: 'CertificationReview-CertificationIndex.business.license',//营业执照
                })}
              ></Form.Item>
            </Col>
            {
              ownerType === 0 ? (
                <Col span={12}>

                  {/* {checkUP} */}
                </Col>
              ):null
            }

            {ownerType === 1 ? (
              <Col span={12}>
                {' '}
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}//船公司安全管理符合证明 DOC
                ></Form.Item>
              </Col>
            ) : null}

            {/* {ownerType === 1 ? (
              <Col span={8}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.charter.party',
                  })}
                ></Form.Item>{' '}
              </Col>
            ) : null} */}
            {ownerType === 0 && userType !== '4' ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}//'船公司安全管理符合证明 DOC
                >
                  {' '}
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          <Row gutter={24}>
            {/* {checkUP} */}
            {check}
            {ownerType === 0 ||  userType == '4' ? checkUP : null}
            {userType === '3' ? checkEndTime : <Col span={9}></Col>}
            {/* {ownerType === 1 ? smc : null} */}
            {/* {ownerType === 1 ? rentShip : null} */}
            {/* {ownerType === 0 ? rentShip : null} */}
            {ownerType === 1 ? doc : null}
            {ownerType === 1 && userType === '3' ? docEndTime : null}
            {ownerType === 0 && userType !== '4' ? doc : null}
            {ownerType === 0 && userType === '3' ? docEndTime : <Col span={9}></Col>}
            {/* {ownerType === 0 && userType !== '4' ? smc : null} */}
          </Row>
          <Row gutter={24}>
            {ownerType === 1 ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}
                ></Form.Item>
              </Col>
            ) : null}
            {ownerType === 0 && userType !== '4' ? (
              <Col span={12}>
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}
                ></Form.Item>
              </Col>
            ) : null}
          </Row>
          <Row gutter={24}>
            {/* {check} */}
            {ownerType === 1 ? smc : null}
            {ownerType === 1 && userType === '3' ? smcEndTime : null}
            {/* {ownerType === 1 ? rentShip : null} */}
            {/* {ownerType === 1 ? doc : null} */}
            {/* {ownerType === 0 && userType !== '4' ? doc : null} */}
            {ownerType === 0 && userType !== '4' ? smc : null}
            {ownerType === 0 && userType === '3' ? smcEndTime : <Col span={9}></Col>}
          </Row>

          {userType === '3' ? (
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {/* 审批意见 */}
                <FormattedMessage id="CertificationReview-CertificationIndex.approval.opinion" />
              </span>
            </div>
          ) : null}
          {userType === '3' ? (
            <Row gutter={24}>
              <Form.Item>
                {getFieldDecorator('checkRemark', {
                  initialValue:
                    isNil(this.state) || isNil(this.state.checkRemark) ? '' : this.state.checkRemark,
                  rules: [
                    {
                      validator: this.checkInputRemark.bind(this),
                    },
                  ],
                })(
                  <TextArea
                    maxLength={512}
                    style={{ width: '100 %' }}
                    rows={4}
                    placeholder={formatMessage({
                      id: 'CertificationReview-CertificationIndex.opinion.input',//请输入您的审批意见
                    })}
                    disabled={false}
                    onChange={e => this.setState({ checkRemark: e.target.value })}
                  />)}
              </Form.Item>
            </Row>
          ) : null}
          {userType === '3' && this.state.checkStatus === 1 ? (
            <Row gutter={24}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="TurnDown"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.reject' })}
                  event={() => this.turnDown(3)}
                  disabled={false}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.approve' })}
                  event={() => this.turnDown(2)}
                  disabled={false}
                />
              </Col>
            </Row>
          ) : null}
          {userType !== '3' && checkStatus !== 0 && !isNil(this.state) && !isNil(this.state.checkRemark) ? (
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...piclayout}
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.approval.opinion',
                  })}
                >
                  <TextArea
                    style={{ width: '100%', border: 'none' }}
                    value={
                      isNil(this.state) || isNil(this.state.checkRemark)
                        ? ''
                        : this.state.checkRemark
                    }
                    rows={4}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
        </Form>
        <Form labelAlign="left">
          <Row className={commonCss.rowTop}>
            {userType == '4' ? (
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.save' })}//保存
                  event={() => {
                    this.handleSubmit_1(0);
                  }}
                  disabled={!isNil(this.state) && (this.state.businessLicenseflag || this.state.securitySmcflag || this.state.securityDoc)} //|| this.state.rentShipContractflag
                />
              </Col>
            ) : null}
            {userType == '4' ? (
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({
                    id: 'CertificationReview-CertificationIndex.saveandsubmit',//保存并提交
                  })}
                  event={() => {
                    this.handleSubmit_1(1);
                  }}
                  disabled={!isNil(this.state) && (this.state.businessLicenseflag || this.state.securitySmcflag || this.state.securityDoc)} //|| this.state.rentShipContractflag
                />
              </Col>
            ) : null}
            {/* handleSubmit_1 */}

            {userType !== '3'&&userType !== '4' ? (
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.save' })}//保存
                  event={() => {
                    this.handleSubmit(0);
                  }}
                  disabled={!isNil(this.state) && (this.state.businessLicenseflag || this.state.securitySmcflag || this.state.securityDoc)} //|| this.state.rentShipContractflag
                />
              </Col>
            ) : null}
            {userType !== '3'&&userType !== '4' ? (
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({
                    id: 'CertificationReview-CertificationIndex.saveandsubmit',//保存并提交
                  })}
                  event={() => {
                    this.handleSubmit(1);
                  }}
                  disabled={!isNil(this.state) && (this.state.businessLicenseflag || this.state.securitySmcflag || this.state.securityDoc)} //|| this.state.rentShipContractflag
                />
              </Col>
            ) : null}
          </Row>
        </Form>
      </div>
      {/* <Modal className="picModal"
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
      </Modal> */}
    </div>);

    if (isIndex) {
      return process;
    } else {
      return index;
    }
  }
}

const UserAuth_Form = Form.create({ name: 'userAuth_form' })(UserAuth);
export default UserAuth_Form;
