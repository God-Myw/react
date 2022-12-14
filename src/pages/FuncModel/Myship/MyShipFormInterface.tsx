import { FormComponentProps } from 'antd/lib/form';

export interface MyShipFormProps extends FormComponentProps {
  type?: number;                  //使用场景的类型
  shipName?: string;              //船名
  buildParticularYear?: string;   //建造年份
  tonNumber?: number;             //吨位
  draft?: number;                 //吃水
  shipDeck?: number;              //船型(字典项)
  capacity?: number;              //舱容
  anchoredPort?: string|number;          //挂靠港口(字典项)
  shipType?: number;              //船舶类型(字典项)
  classificationSociety?: number; //船级社(字典项)
  voyageArea?: number;            //航区(字典项)
  shipCrane?: string;             //船吊
  state?: number;                 //是否发布
  pmiDeadline?:number;            //PMI期限(字典项)
  registryDeadline?:number;           //registyr期限(字典项)
  leaseDeadline?:number;           //lease期限(字典项)
  endTime?: any;               //截止时间
  startTime?: any;             //起始时间
  registryEndTime?: any;               //截止时间
  registryStartTime?: any;             //起始时间
  leaseEndTime?: any;               //截止时间
  leaseStartTime?: any;             //起始时间
  imo?:number;                    //IMO
  mmsi?:number;                   //MMSI
  charterWay?:number;             //租船方式 0航次期租  1定期租  2程租
  picList:PicList[];                   //文件集
  title?: string;
  flag: string;
  checkStatus?:number;            //审核状态
  shipChecks?:any;                //审核对象
  checkRemark?:string;            //审批意见

  pmiFile?:any;
  pmiFileName?:string;
  pmiType?:string;

  registryFile?:any;
  registryFileName?:string;
  registryType?:string;

  leaseFile?:any;
  leaseFileName?:string;
  leaseType?:string;

  shipFile?:any;
  
  previewVisible?: boolean;
  previewImage?:string;
  fileList?:any;
  
  guid?:string;
  match?: any;
  history?: any;
  picNum: number;

  pmiflag?:boolean;
  regflag?:boolean;
  partyflag?:boolean;
  shipflag?:boolean;
}

export interface FileMsg{
  uid?: any;
  name?: string;
  status?: string;
  thumbUrl?: any;
  type?:string;
  fileName?:string;
}

//附件
export interface PicList {
  type?: string;//附件标记
  fileName?: string;//文件名
  fileLog?: number;//文件夹类型
}