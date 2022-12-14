import { FormComponentProps } from 'antd/lib/form';

interface VoyageFormProps extends FormComponentProps {
  shipName: string; //船舶名称
  shipDeck: string; //船型
  shipType: string; //船舶类型
  buildParticularYear?: string; //建造年份
  tonNumber: string; //吨位
  shipCrane: string; //船吊
  draft?: number; //吃水
  portNameCn: string; //港口名称
  contacter: string; //联系人
  contactPhone: string; //联系电话
  phoneCode: string;
  acceptTon: number; //可接受吨位
  acceptCapacity: string; //可接受容积
  shipVoyage: string; //航程
  voyageStartPort: string; //起始港口
  voyageLineName: string; //航线名称
  voyagePort: VoyagePort[];
  match: any;
  history: any;
  shipList: items[]; //船舶名称下拉
  voyageList: items[]; //航线下拉
  anchoredPort: string; //挂靠港口
  disabled: boolean;
  voyageLines: VoyageLine[]; //所有港口信息
  portData: item[]; //港口信息
  guid: number;
  port: number;
  vlId: number;
  voyagePortList: VoyagePort[];
}

export default VoyageFormProps;

export interface Ship {
  shipName: string; //船舶名称
  buildParticularYear: string; //建造年份
  tonNumber: string; //吨位
  draft: number; //吃水
  shipDeck: string; //船型
  capacity: number; //舱容
  shipType: string; //船舶类型
  hatchSize: number; //舱口尺寸
  shipCrane: string; //船吊
}

export interface VoyagePort {
  portTypeName?: string; //港口类型
  arriveDate?: string; //预计到港日期
  viaId?: number; //途经港的ID
  leaveDate?: string; //预计离港日期
  // voyageId: number; //航次表的ID
  portName?: string; //港口名称
}

export interface VoyageLine {
  voyageLineName: string; //航线名称
  guid: number;
  voyageLineNumber: string;
  items: item[];
}

export interface item {
  portTypeName: string;
  countryName: string;
  portName: string;
  portId: number;
  countryId: number;
}

export interface Voyage {
  shipVoyage: string; //航程
  acceptTon: number; //可接受吨位
  acceptCapacity: string; //可接受容积
  voyageLineId: number; //航线主键
  voyageStartPort: string; //预计停留港口
  contacter: string; //联系人
  contactPhone: string; //联系电话
  phoneCode: string;
}

export interface items {
  code: string;
  textValue: string;
}
