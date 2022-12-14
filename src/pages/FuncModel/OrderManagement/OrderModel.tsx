export interface Children {
  guid?: string;

  checkStatus?: string;

  payStatus?: string;

  orderStatus?: string;

  orderNumber?: string;

  deliverStatus?: string;

  goodsLevel?: string;

  goodsType?: string;

  trackServiceId?: string;

}
export interface OrderModel {

  voyageName?: string;

  voyageId?: string;

  trackServiceId?: string;

  grantedUserId?: string;

  orderDto?: Children[];

  children?: Children[];

  entity?: any;

  name?: any;

}


