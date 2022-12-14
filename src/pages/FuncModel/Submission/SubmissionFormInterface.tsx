import { FormComponentProps } from 'antd/lib/form';

interface SubmissionFormProps extends FormComponentProps {
  voyage: Voyage;//航次对象
  ship: Ship;//船舶对象
  voyagePort: VoyagePort[];//航线途径港
  voyageLineName: string;
  pallet: Pallet;//货盘对象
  order: Order;//订单对象
  attachments: Attachments[];//附件
  match: any;
  previewVisible: boolean;
  previewImage: any;
  history: any;
  aFileList: any;
  bFileList: any;
  cFileList: any;
  checkRemark: string;
  type: string;
  fileName: string;
  fileList: any;
  downpayment: string;
  contractMoney: string;
  guid: any;
  picNum: number;
  bigEvent: string;
  tidan: any;
  bill: boolean;
}
export default SubmissionFormProps;

//航线经过港口
export interface VoyagePort {
  arriveDate: string; //预计到港日期
  viaId: number; //途经港的ID
  leaveDate: string; //预计离港日期
  voyageId: number; //航次表的ID
  portName: string; //港口名称
  portTypeName: string;
}

//订单对象
export interface Order {
  guid: string;//主键
  contractMoney: string;//合同金额
  downpayment: string;//定金
  orderType: string;//订单类型
  orderNumber: string;
  orderPeople: string;
  orderTime: string;
  phone: string;
}

//航次对象
export interface Voyage {
  shipVoyage: string;//航程
  acceptTon: string;//可接受吨位
  acceptCapacity: string;//可接受容积
  voyageLineId: string;//航线主键
  voyageStartPort: string//预计停留港口
  phoneCode: string;//手机号段
  contacter: string;//联系人
  contactPhone: string;//联系电话
}

//附件
export interface Attachments {
  type: string;//附件标记
  fileName: string;//文件名
  fileLog: number;//文件夹类型
}

//船舶对象
export interface Ship {
  shipName: string;//船舶名称
  buildParticularYear: string;//建造年份
  tonNumber: string;//吨位
  draft: string;//吃水
  shipDeck: string;//船型
  capacity: string;//船容
  shipType: string;//船舶类型
  shipCrane: string;//船吊
}

//货盘对象
export interface Pallet {
  guid: string;
  goodsLevel: string; //货物名称
  goodsType: string; //货物类型
  goodsWeight: string; //货物重量
  goodsVolume: string; //体积
  goodsCount: string; //货物件数
  isSuperposition: string; //是否可叠加
  startPort: string; //起运港
  destinationPort: string; //目的港
  unloadingDays: string; //卸货天数
  loadingUnloadingVolume: string; //装卸货量
  loadDate: string; //受载日期
  endDate: string; //截止日期
  phoneCode: string;//手机号段
  contactPhone: string; //联系方式
  contacter: string; //联系人
  location: string;//货物存放位置
  goodsProperty: string;//货物性质
  majorParts: string;//是否重大件
  state: string;
}