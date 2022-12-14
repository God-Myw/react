import { FormComponentProps } from 'antd/lib/form';

export interface RoleFormProps extends FormComponentProps {
  id: number;
  roleName: string;
  type: number;
  status: number;
  remark: string;
}
