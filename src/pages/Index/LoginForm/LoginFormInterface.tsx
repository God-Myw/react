import { FormComponentProps } from 'antd/lib/form';

interface LoginAccountFormProps extends FormComponentProps {
  type: number;
  randomUUID: string;
  accountId: string;
  password: string;
  verifyCode: string;
  phoneCode: string;
  phoneNumber: string;
  languageType: number;
  channelId: string;
  deviceSn: string;
  history: any;
  vcodeBase64: string;
}

export default LoginAccountFormProps;
