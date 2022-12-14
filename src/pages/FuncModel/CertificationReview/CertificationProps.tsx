import { FormComponentProps } from "antd/lib/form";

//图片格式
export interface Model {
  fileName: string;
  fileType: string;
  fileLog: number;
  mainId?: string;
}

export interface IState {
  selStatus: string;
  certificationPic: string;
  ownerType: number;
  //营业执照
  businessLicenseFileList: any;
  businessLicenseFileName: string;
  businessLicenseFileType: string;
  // 船公司安全管理符合证明 DOC
  securityDocFileList: any;
  securityDocFileName: string;
  securityDocFileType: string;
  securityDocEndTime: string;
  // 船舶安全管理证书 SMC
  securitySmcFileList: any;
  securitySmcFileName: string;
  securitySmcFileType: string;
  securitySmcEndTime: string;
  // 租船合同
  rentShipContractFileList: any;
  rentShipContractFileName: string;
  rentShipContractFileType: string;

  companyName: string;
  phoneNumber: string;
  faxNumber: string;
  checkRemark: string;
  bankType: string;
  bankNumber: string;
  companyAddress: string;

  userType: any;
  checkStatus: number;

  photoList: Model[];
  previewVisible: boolean;
  previewImage: string;
  guid: string;
  userId: string;

  isIndex:boolean;
  businessLicenseflag:boolean;
  securitySmcflag:boolean;
  rentShipContractflag:boolean;
  securityDoc:boolean;
}

export interface IIProps extends FormComponentProps {
  history?: any;
}