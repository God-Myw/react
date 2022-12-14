// import { Col, Form, Row, Select, DatePicker, Upload, Icon, Modal } from 'antd';
// import { isNil, forEach } from 'lodash';
// import React from 'react';
// import moment from 'moment';
// import commonCss from '../../Common/css/CommonCss.less';
// import { MyShipFormProps } from './MyShipFormInterface';
// import { getDictDetail } from '@/utils/utils';
// import { getRequest } from '@/utils/request';

// class Certificate extends React.Component<MyShipFormProps, MyShipFormProps> {
//   constructor(props: MyShipFormProps) {
//     super(props);
//   }

//   handlePMITermSelect = (value: any) => {
//     this.setState({
//       pmiDeadline: value,
//     });
//   };

//   handleRegistryTermSelect = (value: any) => {
//     this.setState({
//       registryTerm: value,
//     });
//   };

//   // 获取DatePick.value
//   handleStartDatePick = (value: any, dateString: any) => {
//     this.setState({
//       PMIStartDate: value,
//     });
//   }

//   handleEndDateDatePick = (value: any, dateString: any) => {
//     this.setState({
//       PMIEndDate: value,
//     });
//   }

//   handleStartDatePick1 = (value: any, dateString: any) => {
//     this.setState({
//       registryStartDate: value,
//     });
//   }

//   handleEndDateDatePick1 = (value: any, dateString: any) => {
//     this.setState({
//       registryEndDate: value,
//     });
//   }

//   handleCancel = () => this.setState({ previewVisible: false });

//   handlePreviewPMI = async (file: any) => {
//     let params: Map<string, string> = new Map();
//     params.set('type', '1');
//     params.set('fileName', this.state.pmiFile.fileName);
//     getRequest('/sys/file/getImageBase64', params, (response: any) => {
//       this.setState({
//         previewImage: response.data.file.base64,
//         previewVisible: true,
//       });
//     });
//   };
//   handlePreviewReg = async (file: any) => {
//     let params: Map<string, string> = new Map();
//     params.set('type', '2');
//     params.set('fileName', this.state.registryFile.fileName);
//     getRequest('/sys/file/getImageBase64', params, (response: any) => {
//       this.setState({
//         previewImage: response.data.file.base64,
//         previewVisible: true,
//       });
//     });
//   };

//   // 检查图片是否上传
//   checkFile = (rule: any, val: any, callback: any) => {
//     if (isNil(this.state.pmiFile) || this.state.pmiFile.length === 0) {
//       callback('上传图片不能为空');
//     } else {
//       callback();
//     }
//   };

//   checkFile1 = (rule: any, val: any, callback: any) => {
//     if (isNil(this.state.registryFile) || this.state.registryFile.length === 0) {
//       callback('上传图片不能为空');
//     } else {
//       callback();
//     }
//   };

//   //上传图片变更
//   handleChangePMI = ({ fileList }: any) => {
//     if (fileList.length > 0) {
//       forEach(fileList, (file) => {
//         if (file.status === 'done') {
//           this.setState({
//             pmiFileName: file.response.data.fileName,
//             pmiType: file.response.data.type,
//           })
//         }
//         this.setState({ pmiFile: fileList });
//       });
//     }
//   };

//   handleChangeReg = ({ fileList }: any) => {
//     if (fileList.length > 0) {
//       forEach(fileList, (file) => {
//         if (file.status === 'done') {
//           this.setState({
//             registryFileName: file.response.data.fileName,
//             registryType: file.response.data.type,
//           })
//         }
//         this.setState({ registryFile:fileList });
//       });
//     } 
//   };

//   //删除图片
//   onRemovePMI = () => {
//     this.setState(() => ({
//       pmiFile: []
//     }));
//   }

//   onRemoveReg = () => {
//     this.setState(() => ({
//       registryFile: []
//     }));
//   }

//   handleDownloadPMI = () => {
//     1
//   }

//   handleDownloadReg = () => {
//     2
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
//         <div className="ant-upload-text">上传图片</div>
//       </div>
//     );

//     return (
//       <div>
//         <div className={commonCss.title}>
//           <span className={commonCss.text}>{"证书"}</span>
//         </div>
//         <div className={commonCss.AddForm}>
//           <Form labelAlign="left">
//             <Row gutter={24}>
//               <Col span={12}>
//                 <span>{"船东互保证书P&I"}</span>
//                 <Form.Item {...formlayout} label="">
//                   {getFieldDecorator(`PMI`, {
//                     rules: [
//                       {
//                         validator: this.checkFile.bind(this),
//                       },
//                     ],
//                   })(
//                     <Upload
//                       action="/sys/file/upload"
//                       listType="picture-card"
//                       data={{ type: 1 }}
//                       supportServerRender={true}
//                       className={commonCss.PMIPic}
//                       fileList={isNil(this.state) || isNil(this.state.pmiFile) || this.state.pmiFile.length === 0 ? '' : this.state.pmiFile}
//                       onPreview={this.handlePreviewPMI}
//                       onChange={this.handleChangePMI}
//                       onDownload={this.handleDownloadPMI}
//                       onRemove={this.onRemovePMI}
//                     >
//                       {isNil(this.state) || isNil(this.state.pmiFile) || this.state.pmiFile.length < 1 ?
//                         uploadButton : null}
//                     </Upload>,
//                   )}
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item {...formlayout} label="有效期限">
//                   {getFieldDecorator('PMI_term', {
//                     initialValue:
//                       this.state == null || this.state.pmiDeadline == null
//                         ? ''
//                         : this.state.pmiDeadline.toString(),
//                     rules: [
//                       {
//                         required: true,
//                         whitespace: true,
//                         message: '有效期限不能为空!',
//                       },
//                     ],
//                   })(
//                     <Select placeholder="有效期限" onChange={this.handlePMITermSelect}>
//                       {
//                         getDictDetail('PMI_term').map((item: any) => <option value={item.code}>{item.textValue}</option>)
//                       }
//                     </Select>,
//                   )}
//                 </Form.Item>
//                 <Form.Item {...formlayout} label="起始日期">
//                   {getFieldDecorator(`PMIStartDate`, {
//                     initialValue:
//                       isNil(this.state) || isNil(this.state.PMIStartDate) || this.state.PMIStartDate === ''
//                         ? moment()
//                         : moment(this.state.PMIStartDate, 'YYYY-MM-DD'),
//                     rules: [
//                       {
//                         required: true,
//                         message: '起始日期不能为空!',
//                       },
//                     ],
//                   })(
//                     <DatePicker
//                       style={{ width: '100%' }}
//                       placeholder="请输入起始日期"
//                       onChange={this.handleStartDatePick}
//                     />,
//                   )}
//                 </Form.Item>
//                 <Form.Item {...formlayout} label="截止日期">
//                   {getFieldDecorator(`PMIEndDate`, {
//                     initialValue:
//                       isNil(this.state) || isNil(this.state.PMIEndDate) || this.state.PMIEndDate === ''
//                         ? moment()
//                         : moment(this.state.PMIEndDate, 'YYYY-MM-DD'),
//                     rules: [
//                       {
//                         required: true,
//                         message: '截止日期不能为空!',
//                       },
//                     ],
//                   })(
//                     <DatePicker
//                       style={{ width: '100%' }}
//                       placeholder="请输入截止日期"
//                       onChange={this.handleEndDateDatePick}
//                     />,
//                   )}
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={24}>
//               <Col span={12}>
//                 <span>{"船舶登记证书certificate of registry"}</span>
//                 <Form.Item {...formlayout} label="">
//                   {getFieldDecorator(`registry`, {
//                     rules: [
//                       {
//                         validator: this.checkFile1.bind(this),
//                       },
//                     ],
//                   })(
//                     <Upload
//                       action="/sys/file/upload"
//                       listType="picture-card"
//                       data={{ type: 2 }}
//                       className={commonCss.PMIPic}
//                       fileList={isNil(this.state) || isNil(this.state.registryFile) || this.state.registryFile.length === 0 ? '' : this.state.registryFile}
//                       onPreview={this.handlePreviewReg}
//                       onChange={this.handleChangeReg}
//                       onDownload={this.handleDownloadReg}
//                       onRemove={this.onRemoveReg}
//                     >
//                       {isNil(this.state) || isNil(this.state.registryFile) || this.state.registryFile.length < 1 ?
//                         uploadButton : null}
//                     </Upload>,
//                   )}
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item {...formlayout} label="有效期限">
//                   {getFieldDecorator('registry_term', {
//                     initialValue:
//                       this.state == null || this.state.pmiDeadline == null
//                         ? ''
//                         : this.state.pmiDeadline.toString(),
//                     rules: [
//                       {
//                         required: true,
//                         whitespace: true,
//                         message: '有效期限不能为空!',
//                       },
//                     ],
//                   })(
//                     <Select placeholder="有效期限" onChange={this.handlePMITermSelect}>
//                       {
//                         getDictDetail('PMI_term').map((item: any) => <option value={item.code}>{item.textValue}</option>)
//                       }
//                     </Select>,
//                   )}
//                 </Form.Item>
//                 <Form.Item {...formlayout} label="起始日期">
//                   {getFieldDecorator(`registryStartDate`, {
//                     initialValue:
//                       isNil(this.state) || isNil(this.state.registryStartDate) || this.state.registryStartDate === ''
//                         ? moment()
//                         : moment(this.state.registryStartDate, 'YYYY-MM-DD'),
//                     rules: [
//                       {
//                         required: true,
//                         message: '起始日期不能为空!',
//                       },
//                     ],
//                   })(
//                     <DatePicker
//                       style={{ width: '100%' }}
//                       placeholder="请输入起始日期"
//                       onChange={this.handleStartDatePick1}
//                     />,
//                   )}
//                 </Form.Item>
//                 <Form.Item {...formlayout} label="截止日期">
//                   {getFieldDecorator(`registryEndDate`, {
//                     initialValue:
//                       isNil(this.state) || isNil(this.state.registryEndDate) || this.state.registryEndDate === ''
//                         ? moment()
//                         : moment(this.state.registryEndDate, 'YYYY-MM-DD'),
//                     rules: [
//                       {
//                         required: true,
//                         message: '截止日期不能为空!',
//                       },
//                     ],
//                   })(
//                     <DatePicker
//                       style={{ width: '100%' }}
//                       placeholder="请输入截止日期"
//                       onChange={this.handleEndDateDatePick1}
//                     />,
//                   )}
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//         <Modal
//           visible={isNil(this.state) || isNil(this.state.previewVisible) ? false : this.state.previewVisible}
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

// const Certificate_Form = Form.create({ name: 'Certificate_Form' })(Certificate);

// export default Certificate_Form;
