import { FormComponentProps } from 'antd/lib/form';

interface PalletFormProps extends FormComponentProps {
    guid: string;
    goodsLevel: string;
    goodsType: string;
    location: string;
    goodsProperty: string;
    goodsWeight: string;
    goodsVolume: string;
    goodsCount: string;
    isSuperposition: string;
    startPort: string;
    destinationPort: string;
    unloadingDays: string;
    loadingUnloadingVolume: string;
    loadDate: string;
    endDate: string;
    contacter: string;
    phoneCode: string;
    contactPhone: string;
    majorParts: string;
    status: string;
    state: string;
    fileList: any;
    palletFile: any;
    history: any;
    match: any;
    previewVisible: boolean;
    previewImage: any;
    matchStopStatus: any;
    remark: string;
    unloadingflag:boolean;
    matchId:any;
}
export default PalletFormProps;

//图片格式
export interface voyage {
    voyageName: string;
    matchStopStatus: number;
    guid: number;
}
