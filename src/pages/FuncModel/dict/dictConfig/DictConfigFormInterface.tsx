import { FormComponentProps } from 'antd/lib/form';

export interface DictConfigFormProps extends FormComponentProps {
  modaldictTypeId: number;
  name: string;
  titleCn: string;
  titleEn: string;
  history:any;
}
