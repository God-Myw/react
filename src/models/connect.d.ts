import { MenuDataItem } from '@ant-design/pro-layout';
import { AnyAction, Dispatch } from 'redux';
import { RouterTypes } from 'umi';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { MenuModelType } from './menu';

export { SettingModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  settings: SettingModelState;
  menus: MenuModelType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
