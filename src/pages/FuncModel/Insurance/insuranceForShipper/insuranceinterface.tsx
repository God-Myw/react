import { FormComponentProps } from 'antd/lib/form';

interface InsuranceFormProps extends FormComponentProps {
  flag: string;
  goodsName: string;
  goodstype: string;
  package: string;
  packageNumber: string;
  bill: string;
  phoneCode: string;
  contactNumber: string;
  order: string;
  holderName: string;
  combination: string;
  ownerName: string;
  insuredPhoneCode: string;
  ownerContarct: string;
  ownercombination: string;
  shiplines: string;
  ways: string;
  shipage: string;
  sporttime: Date;
  travelStart: string;
  travelEnd: string;
  goodsValue: string;
  insuranceValue: string;
  insuranceCompany: string;
  insuranceTypes: string;
  tips: string;
  tipsaccount: string;
  guid: string;
  match: any;
  history: any;
  agreePro: boolean; // 是否已勾选同意协议
  modalVisible0: boolean; // 弹出框是否显示
  buttonDisabled: boolean; // 按钮是否可用
  modalVisible1: boolean;
  modalVisible2: boolean;
}

export default InsuranceFormProps;
