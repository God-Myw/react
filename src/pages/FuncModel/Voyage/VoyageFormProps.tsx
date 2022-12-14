import { FormComponentProps } from 'antd/lib/form';

interface VoyageFormProps extends FormComponentProps {
  shipId?: string;
  shipVoyage?: string;
  accepTon?: string;
  acceptCapacity?: string;
  voyageStartPort?: string;
  voyageLineId?: string;
  contacter?: string;
  phoneCode?: string;
  contactPhone?: string;
  state?: string;
  guid: number;
  // voyagePortVo?:[]{
  //     viaId?:string;
  //     arriveDate?:number;
  //     leaveDate?:number;
  // }
}

export default VoyageFormProps;
