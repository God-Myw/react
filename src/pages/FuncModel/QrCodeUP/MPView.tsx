// import { Upload, Icon, Modal, Form, Row } from 'antd';
import getRequest, { postRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload, message, DatePicker, Select, Button, Modal, Icon } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { FileModel } from './FileModel';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';
import UserListForm from '../MessagePush/userlist';
import e from 'express';
const FormItem = Form.Item;

class MPView extends React.Component<ShipCertificationFormProps, CertificationProps> {
  state = {
    previewVisible: false,
    previewImage: '',
    imgList: [],
    fileName1: '',
    OK: false,
    COK: false,
  };


  handleChange = ({ file, fileList,event }) => {
    // console.log(file); // file 是当前正在上传的 单个 img
    // console.log(fileList[0].response); // fileList 是已上传的全部 img 列表
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


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };


  // 参考链接：https://www.jianshu.com/p/f356f050b3c9
  handleBeforeUpload = file => {
    //限制图片 格式、size、分辨率
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      Modal.error({
        title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
      });
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Modal.error({
        title: '超过2M限制，不允许上传~',
      });
      return;
    }
    return (isJPG || isJPEG || isGIF || isPNG) && isLt2M && this.checkImageWH(file);
  };

  //返回一个 promise：检测通过则返回resolve；失败则返回reject，并阻止图片上传
  checkImageWH(file) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function() {
          // 获取图片的宽高，并存放到file对象中
          console.log('file width :' + this.width);
          console.log('file height :' + this.height);
          file.width = this.width;
          file.height = this.height;
          resolve();
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {// values 是form表单里的参数
      // 点击按钮后，将表单提交给后台
      dispatch({
        type: 'mymodel/submitFormData',
        payload: values,
      });
    });
  };

    // 返回
    onBack = () => {
      //得到当前审核状态
      let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
      // console.log(this.props.match.params['status'])
      // 跳转首页
      this.props.history.push(`/qrCodeUpload/list`);
    };
    //发送
    turnDown=()=>{
      let A = this.state.fileName1
      let requestData = {
        fileName : A,
        creater : 156,
      };
      if(!A){
        console.log(123)
      }else{
        postRequest('/business/qrcode/saveQRCode', JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if(response){
            if (response.status === 200) {
              // this.props.history.push(`/manualMessage/list`);
              this.showModalOK()
              console.log('成功')
            } else {
              console.log('不成功');
              this.showModalNO()
            }
          }else{
            console.log(biubiubiu)
          }
        });
        console.log(456)
      }

    }

  //成功
  showModalOK = () => {
    this.setState({
      OK: true,
    });
  };

  HOk = e => {
    console.log(e);
    this.setState({
      OK: false,
    });
    this.props.history.push(`/qrCodeUpload/list`);
  };

  HCancel = e => {
    console.log(e);
    this.setState({
      OK: false,
    });
    this.props.history.push(`/qrCodeUpload/list`);
  };

  //不成功
  showModalNO = () => {
    this.setState({
      COK: true,
    });
  };

  CCOk = e => {
    console.log(e);
    this.setState({
      COK: false,
    });
  };

  CCancel = e => {
    console.log(e);
    this.setState({
      COK: false,
    });
  };


  render() {
    const { previewVisible, previewImage, imgList } = this.state; //  从 state 中拿数据
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (

      <div className="clearfix">
        <Modal
            title="成功"
            visible={this.state.OK}
            onOk={this.HOk}
            onCancel={this.HCancel}
            closable={false}
          >
            <p>发送成功</p>
          </Modal>

          <Modal
            title="失败"
            visible={this.state.COK}
            onOk={this.CCOk}
            onCancel={this.CCancel}
            closable={false}
          >
            <p>发送失败</p>
          </Modal>

        <LabelTitleComponent text="二维码上传" event={() => { this.props.history.push('/qrCodeUpload/list'); }}/>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem label="图片图片" >

              <Upload
                action="/api/sys/file/upLoadFuJian/QRCode" // 这个是图片上传的接口请求，实际开发中，要替换成你自己的业务接口
                data={file => ({ // data里存放的是接口的请求参数
                  fileName : "fdsafdsa.jgp",
                  creater : 156,
                  photoCotent: file, // file 是当前正在上传的图片
                  photoWidth: file.height, // 通过  handleBeforeUpload 获取 图片的宽高
                  photoHeight: file.width,
                })}
                listType="picture-card"
                fileList={this.state.imgList}
                onPreview={this.handlePreview} // 点击图片缩略图，进行预览
                beforeUpload={this.handleBeforeUpload} // 上传之前，对图片的格式做校验，并获取图片的宽高
                onChange={this.handleChange} // 每次上传图片时，都会触发这个方法
              >
                {this.state.imgList.length >= 1 ? null : uploadButton}
              </Upload>

          </FormItem>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <div>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              {this.props.match.params['guid'] == '0' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['guid'] == '0' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="发送"
                    event={() => this.turnDown()}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['guid'] == '0' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params['status'] == '0' ? null : <Col span={7}></Col>}
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(
  MPView,
);
export default ShipCertificationView_Form;

