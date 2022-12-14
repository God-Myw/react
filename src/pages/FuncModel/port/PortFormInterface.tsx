import { FormComponentProps } from 'antd/lib/form';

export interface PortFormProps extends FormComponentProps {
  countryName: string;
  portName: string;
  history:any;
}
