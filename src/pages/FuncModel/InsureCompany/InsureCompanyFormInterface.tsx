import { FormComponentProps } from 'antd/lib/form';

export interface InsureCompanyFormProps extends FormComponentProps {
  companyCode: string;
  companyName: string;
  rate: string;
  address: string;
  contactPhone: string;
  contacter: string;
  history:any;
  flag: string;
}
