import { Subscription } from 'dva';
import { Reducer } from 'redux';

export interface MenuModelType {
  namespace: 'menu';
  state: { isShow: boolean, visible: boolean, unreadCount: number };
  effects: {
    // changeShowChat: Effect;
  };
  reducers: {
    changeShowChat: Reducer<{ isShow: boolean; visible: boolean }>;
    save: Reducer<{ visible: boolean }>;
    counter : Reducer<{ unreadCount: number }>;
  };
  subscriptions: { changeShowChat: Subscription };
}

const MenuModel: MenuModelType = {
  namespace: 'menu', //命名空间名字，必填
  state: { isShow: false, visible: false, unreadCount: 0 }, //state就是用来放初始值的
  effects: {
    //后台交互，后期再考虑
    //     *changeShowChat(_, { call, put }) {
    //         const response = yield call(queryUsers);
    //         yield put({
    //             type: 'save',
    //             payload: response,
    //         });
    //     },
  },
  // 能改变界面的action应该放这里,这里按官方意思不应该做数据处理，只是用来return state 从而改变界面
  reducers: {
    changeShowChat(state, { payload: { isShow, visible } }) {
      return { ...state, isShow, visible };
    },
    save(state, { payload: { visible } }) {
      return { ...state, visible };
    },
    counter(state, { payload: { unreadCount } }) {
      return { ...state, unreadCount };
    },
  },
  subscriptions: { // 这个其实暂时没有什么用
    changeShowChat({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        dispatch({
          type: 'save',
          payload: { visible: false },
        });
      });
    },
  },
};

export default MenuModel;
