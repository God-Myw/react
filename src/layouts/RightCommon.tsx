import { MenuModelType } from '@/models/menu';
import ChatMsg from '@/pages/Index/ChatComponents/ChatMsg';
import { connect } from 'dva';
import React from 'react';

interface models {
  isShow: boolean;
  visible: boolean;
}

@connect((menuModel: MenuModelType) => ({
  menuModel: menuModel,
}))
class RightCommon extends React.Component<models, {}> {
  render() {
    // let orignalSetItem = localStorage.setItem;
    // localStorage.setItem = function (key, newValue) {
    //   const setItemEvent = new Event("setItemEvent");
    //   setItemEvent.key = key;
    //   window.dispatchEvent(setItemEvent);
    //   orignalSetItem.apply(this, arguments);
    // };

    const { isShow, visible } = this.props;

    return (
      <div>
        {isShow ? (
          <ChatMsg visible={visible} sty={{ position: 'fixed', bottom: '0', left: '12%' }} />
        ) : (
            ''
          )}
      </div>
    );
  }
}

function mapStateToProps(state: { menu: { isShow: boolean; visible: boolean } }) {
  const { isShow, visible } = state.menu;
  return {
    isShow,
    visible,
  };
}

export default connect(mapStateToProps)(RightCommon);
