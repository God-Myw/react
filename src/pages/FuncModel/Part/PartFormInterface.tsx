import { FormComponentProps } from 'antd/lib/form';

export interface PartFormProps extends FormComponentProps {
  guid: number;
  type: number;
  partName: string;
  tradeType: number;
  drawingNumber: string;
  partModel: string;
  partCount: number;
  partNumber: string;
  contacter: string;
  phoneCode: string;
  phoneNumber: string;
  remark: string;
  state: number;
  history: any;
  flag: string;
  title: string;
  match: any;
  previewVisible: boolean;
  previewImage: string;
  fileList: any;
}
