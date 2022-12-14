import { FormComponentProps } from 'antd/lib/form';

export interface ShipSparePartsViewFormProps extends FormComponentProps {
  match: any;
  history: any;
}

export interface PicList {
  type?: string;//附件标记
  fileName?: string;//文件名
  fileLog?: number;//文件夹类型
}

export interface StoreList {
  imgUrl?: string;//型号图片
  type?: string;//型号
  price?: number;//价格
  count?: number;//库存
}