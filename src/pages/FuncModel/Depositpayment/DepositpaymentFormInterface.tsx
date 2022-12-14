import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';

type Deposit = RouteComponentProps & FormComponentProps

export interface DepositpaymentFormProps extends Deposit {
    previewVisible: boolean;
    previewImage: string;
    imgurl: string;
    fileList: any;
    agreePro: boolean; // 是否已勾选同意协议
    modalVisible: boolean; // 弹出框是否显示
    buttonDisabled: boolean; // 按钮是否可用
    nameID: any; //用户名ID
    nameTP: any; //用户名类型
    money: string; //金额
    picList: picList,
    type: string;
    fileName: string;
    fileLog: string;
    payStatus: number;
    depoflag: boolean;
}

export interface picList {
    fileName: string;
    fileType: string;
    fileLog: string;
}