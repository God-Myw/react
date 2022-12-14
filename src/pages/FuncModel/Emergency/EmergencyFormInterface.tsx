import { FormComponentProps } from 'antd/lib/form';

interface EmergencyFormProps extends FormComponentProps {
  requestIndex: string;
  requestTitle: string;
  requestContent: string;
  createDate: string;
  state: string;
  guid: string;
  history: any;
  match: any;
  flag: string;
  title: string;
}

export default EmergencyFormProps;
