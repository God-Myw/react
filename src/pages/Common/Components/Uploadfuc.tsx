import React from 'react';
import { Upload, message, Icon } from 'antd';
import getRequest from '@/utils/request';

//单个图片上传控件
function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

interface IUploadfucComponent {
  photoUp?: any;
  type: string;
  imageUrl: string;
}

interface IUploadfucInterface {
  loading: boolean;
  imageUrl: string;
}

class Uploadfuc extends React.Component<IUploadfucComponent, IUploadfucInterface> {
  constructor(prop: IUploadfucComponent) {
    super(prop);
  }
  state = {
    loading: false,
    imageUrl: this.props.imageUrl ? this.props.imageUrl : '',
  };

  upLoad = (info: any) => {
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    // 获取验证码
    getRequest('/sys/verify/code', param, (response: any) => {
      if (response.status === 200) {
        let prefixBase64 = 'data:image/jpg;base64';
        this.setState({
          imageUrl: prefixBase64.concat(','.concat(response.data)),
        });
        this.props.photoUp(this.props.type, prefixBase64.concat(','.concat(response.data)));
      }
    });
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="photo1"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={this.upLoad}
      >
        {imageUrl ? <img src={imageUrl} alt="photo1" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default Uploadfuc;
