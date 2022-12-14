// import { Form, Row, Upload, Icon, Modal } from 'antd';
// import { isNil, forEach } from 'lodash';
// import React from 'react';
// import commonCss from '../../Common/css/CommonCss.less';
// import { MyShipFormProps } from './MyShipFormInterface';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import getRequest from '@/utils/request';

// class UploadMyShipPic extends React.Component<MyShipFormProps, MyShipFormProps> {
//   constructor(props: MyShipFormProps) {
//     super(props);
//   }

//   handleCancel = () => this.setState({ previewVisible: false });

//   handlePreview = async (file:any) => {
//     let params: Map<string, string> = new Map();
//     params.set('type', '3');
//     params.set('fileName', this.state.shipFile.fileName);
//     getRequest('/sys/file/getImageBase64', params, (response: any) => {
//       this.setState({
//         previewImage: response.data.file.base64,
//         previewVisible: true,
//       });
//     });
//   };

//     // 检查图片是否上传
//   checkFile = (rule: any, val: any, callback: any) => {
//     if (isNil(this.state.shipFile) || this.state.shipFile.length === 0) {
//       callback(formatMessage({ id: 'Myship-.UploadMyShip.null' }));
//     } else {
//       callback();
//     }
//   };

//   //上传图片变更
//   handleChange = ({ fileList }: any) => {
//     if (!isNil(fileList) && fileList.length > 0) {
//       forEach(fileList, (file) => {
//         if (file.status === 'done') {
//           this.setState({
//             shipFile: [{
//               name: file.response.data.fileName,
//               type: file.response.data.type,
//               fileLog: '13',
//             }],
//           })
//         }
//         this.setState({ fileList });
//       });
//     }
//   };

//   handleDownload=()=>{
//     3
//   }

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const formlayout = {
//       labelCol: { span: 6 },
//       wrapperCol: { span: 18 },
//     };

//     const uploadButton = (
//       <div>
//         <Icon type="plus" />
//         <div className="ant-upload-text"><FormattedMessage id="Myship-.UploadMyShip.upload" /></div>
//       </div>
//     );

//     return (
//       <div className={commonCss.container}>
//         <div className={commonCss.title}>
//           <span className={commonCss.text}>{formatMessage({ id: 'Myship-MyshipView.upload.picture' })}</span>
//         </div>
//         <div className={commonCss.AddForm}>
//           <Form labelAlign="left">
//             <Row gutter={24}>
//               <Form.Item {...formlayout} label="">
//                 {getFieldDecorator(`picture`, {
//                   rules: [
//                     {
//                       validator: this.checkFile.bind(this),
//                     },
//                   ],
//                 })(
//                   <Upload
//                     action="/sys/file/upload"
//                     listType="picture-card"
//                     data={{ type: 3 }}
//                     fileList={isNil(this.state) || isNil(this.state.shipFile) || this.state.shipFile.length === 0 ? '' : this.state.shipFile}
//                     onPreview={this.handlePreview}
//                     onChange={this.handleChange}
//                     onDownload={this.handleDownload}
//                   >
//                     {isNil(this.state) || isNil(this.state.shipFile) || this.state.shipFile.length < 3 ?
//                      uploadButton : null}
//                   </Upload>,
//                 )}
//               </Form.Item>
//             </Row>
//           </Form>
//         </div>
//         <Modal
//           visible={isNil(this.state) || isNil(this.state.previewVisible)? false : this.state.previewVisible}
//           footer={null}
//           onCancel={this.handleCancel}
//         >
//           <img
//             alt="example"
//             style={{ width: '100%' }}
//             src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
//           />
//         </Modal>
//       </div>
//     );
//   }
// }

// const UploadMyShipPicForm = Form.create({ name: 'UploadMyShipPic_Form' })(UploadMyShipPic);

// export default UploadMyShipPicForm;
