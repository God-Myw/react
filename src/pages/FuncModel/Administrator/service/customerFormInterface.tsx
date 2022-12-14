import { FormComponentProps } from 'antd/lib/form';

export interface CustomerFormProps extends FormComponentProps {
  accountId?: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  belongPort?: string;
  phoneCode?: string;
  phoneNumber?: string;
  passWord?: string;
  status?: string;
  guid?: any;
  history:any;
}
