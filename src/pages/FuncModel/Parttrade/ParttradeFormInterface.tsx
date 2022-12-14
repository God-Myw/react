import { FormComponentProps } from 'antd/lib/form';

interface ParttradeFormProps extends FormComponentProps {
  tradeType: string;
  partName: string;
  partModel: string;
  partCount: number;
  drawingNumber: string;
  partNumber: string;
  guid: string;
}

export default ParttradeFormProps;
