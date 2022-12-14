import { FormComponentProps } from 'antd/lib/form';

interface PalletFormProps extends FormComponentProps {
  goodsLevel: string;
  goodsSubLevel: string;
  goodsType: string;
  goodsWeight: string;
  BIG:string;
  getFieldDecorator:string;
  goodsVolume: string;
  goodsCount: string;
  isSuperposition: string;
  startPort: string;
  destinationPort: string;
  loadDate: any;
  endDate: any;
  contacter: string;
  phoneCode: string;
  contactPhone: string;
  loadingUnloadingVolume: string;
  unloadingDays: string;
  createDate: string;
  state: string;
  guid: string;
  history: any;
  match: any;
  flag: string;
  currentPage: number;
  previewVisible: boolean;
  previewImage: string;
  fileList: any;
  title: string;
  uid: string;
  type: string;
  fileName: string;
  majorParts:string;
  goodsProperty:any;
  location:any;
  picflag:boolean;
  unloadingflag:boolean;
}

export default PalletFormProps;
