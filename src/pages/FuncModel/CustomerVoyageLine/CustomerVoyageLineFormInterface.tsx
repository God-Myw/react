import { FormComponentProps } from 'antd/lib/form';

interface CustomerVoyageLineFormProps extends FormComponentProps {
  guid: number, //id
  items: item[], //下拉航线列表
  voyageLineName: string, //当前航线名
  voyageLineNumber: string, //当前航线编号
  voyageIntention: string,//航次意向
  currentPort: string,//船舶当前位置
  portIntention: string,//意向港口
  locationIntention: string//意向区域
  history:any;
  match: any;
}

export default CustomerVoyageLineFormProps;

interface item {
  portTypeName: string,
  countryName: string,
  portName: string,
}
