import { FormComponentProps } from 'antd/lib/form';

interface ShipTradeFormProps extends FormComponentProps {
  shipTradeIndex: string;
  guid: number;
  shipType: number;
  shipAge: number;
  tradeType: number;
  voyageArea: number;
  classificationSociety: number;
  tonNumber: DoubleRange;
  state: number;
  match: any;
  history: any;
  remark: string;
  email: string;

  imo:number;   //IMO号
  shipName:string;   //船名
  buildAddress:string; //建造地点
  buildParticularYear:string;//建造年份
  draft:number;//吃水
  netWeight:number;//净重
  hatchesNumber:number;//舱口数量

  checkFile:any;//船舶检验证书集合
  checkFileList:PicList[];  
  checkflag:boolean;

  ownershipFile:any;//船舶所有权证书集合
  ownershipFileList:PicList[];
  ownershipflag:boolean;

  loadLineFile:any;//船舶载重线证书集合
  loadLineFileList:PicList[];
  loadLineflag:boolean;

  specificationFile:any;//船舶规范证书集合
  specificationFileList:PicList[];
  specificationflag:boolean;

  airworthinessFile:any;//船舶适航证书集合
  airworthinessFileList:PicList[];
  airworthinessflag:boolean;

  shipFile:any;//船舶照片集合
  shipFileList:PicList[];
  shipflag:boolean;

  previewVisible?: boolean;
  previewImage?:string;
  picNum: number;
}

export default ShipTradeFormProps;

//附件
export interface PicList {
  type?: string;//附件标记
  fileName?: string;//文件名
  fileLog?: number;//文件夹类型
}

export interface FileMsg{
  uid?: any;
  name?: string;
  status?: string;
  thumbUrl?: any;
  type?:string;
  fileName?:string;
}