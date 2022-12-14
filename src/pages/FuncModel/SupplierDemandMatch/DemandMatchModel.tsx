export interface PalletModel {
  palletId?: number; //货盘id
  goodsType?: string; //货盘类型id
  goodsProperty?: string;//货物类型id
  goodsWeight?: number;//货物重量
  contacter?: string;//联系人
  phoneCode?: any; //电话
  contactPhone?: string; //电话号码
  startPort?: string;//开始港口id
  destinationPort?: string; //离开港口id
  sortIndex?: string;//排序字段
  orderStatus?: number;
}
