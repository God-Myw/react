import { FormComponentProps } from 'antd/lib/form';
import { items } from '@/utils/utils';

interface InsuranceFormProps extends FormComponentProps {
  agreePro: boolean,
  modalVisible0: boolean,
  modalVisible1: boolean,
  modalVisible2: boolean,
  buttonDisabled: boolean,
  flag: string;
  policyholderIdType: string;
  policyHolder: string;
  policyholderIdNumber: string;
  insuranceCompany: number;
  phoneCode: string;
  contactNumber: string;
  shipId: number;
  shipName: string;
  shipAge: string;
  transportStart: string;
  contactAddress: string;
  transportContacter: string;
  guid: number;
  match: any;
  history: any;
  companyItem: items[];
  shipItem: items[]
}
export default InsuranceFormProps;
