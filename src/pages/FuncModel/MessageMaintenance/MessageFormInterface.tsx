import { FormComponentProps } from 'antd/lib/form';
import { AnyAction, Dispatch } from 'redux';

interface MessageFormProps extends FormComponentProps {
  isShow: boolean;
  visible: boolean;
  sty: React.CSSProperties;
  dispatch?: Dispatch<AnyAction>;
}
export default MessageFormProps;
