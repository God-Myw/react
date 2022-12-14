import { FormComponentProps } from 'antd/lib/form';

interface PalletFormProps extends FormComponentProps {
  goodsLevel: string;
  goodsSubLevel: string;
  goodsType: string;
  goodsWeight: string;
  goodsVolume: string;
  goodsCount: string;
  isSuperposition: string;
  startPort: string;
  destinationPort: string;
  loadDate: string;
  endDate: string;
  contacter: string;
  contactPhone: string;
  loadingUnloadingVolume: string;
  unloadingDays: string;
  createDate: string;
  state: string;
  guid: string;
  history: any;
  match: any;
  flag: string;

  phoneCode: string;
  remark: string;
  previewVisible: boolean;
  previewImage: any;
  fileList: any;
  palletFile: any;
  location:string;
  goodsProperty: string;
  majorParts: string;
  unloadingflag:boolean;
  fileName: string;
  picflag:boolean;
  isCollected:boolean
}

export default PalletFormProps;

export interface FileModel {
  uid?: any;
  name?: string;
  status?: string;
  thumbUrl?: any;
}

//附件
export interface PicList {
  type?: string;//附件标记
  fileName?: string;//文件名
  fileLog?: number;//文件夹类型
}
