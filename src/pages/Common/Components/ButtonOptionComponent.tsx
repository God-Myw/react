import React from 'react';
import { Button } from 'antd';

interface IButtonOptionComponent {
  type: string;
  text: string;
  event: () => void;
  disabled?: boolean;
}

interface IButtonOptionInterface {
  type: string;
  text: string;
  event: () => void;
}

class ButtonOptionComponent extends React.Component<
  IButtonOptionComponent,
  IButtonOptionInterface
> {
  constructor(prop: IButtonOptionComponent) {
    super(prop);
  }
  render() {
    const { type, text, event, disabled } = this.props;
    let returnResult;
    // 编辑按钮
    if (type == 'Edit') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="edit"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="edit"
            size="small"
            style={{ backgroundColor: '#EBC46D', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }

      // 申请审核
    } else if (type == 'Certification') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="form"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="form"
            size="small"
            style={{ backgroundColor: '#7CCD7C', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 删除按钮
    } else if (type == 'Delete') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="delete"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="delete"
            size="small"
            style={{ backgroundColor: '#DB6262', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 查询按钮
    } else if (type == 'Query') {
      returnResult = (
        <Button
          style={{ width: '5%', backgroundColor: '#135A8D', color: '#FFFFFF' }}
          onClick={event}
        >
          {text}
        </Button>
      );
      // 批量删除
    } else if (type == 'BatchDelete') {
      returnResult = (
        <Button
          style={{ width: '8%', backgroundColor: '#135A8D', color: '#FFFFFF' }}
          onClick={event}
        >
          {text}
        </Button>
      );
    } else if (type == 'Add') {
      returnResult = (
        <Button
          icon="plus"
          style={{
            width: '3%',
            backgroundColor: '#135A8D',
            float: 'right',
            color: '#FFFFFF',
            lineHeight: '20px',
            fontSize: '20px',
          }}
          onClick={event}
        ></Button>
      );
      // 查看按钮
    } else if (type == 'View') {
      returnResult = (
        <Button
          icon="database"
          size="small"
          style={{ backgroundColor: '#57B5E3', color: '#FFFFFF' }}
          onClick={event}
        >
          {text}
        </Button>
      );
      // 关闭按钮
    } else if (type == 'Close') {
      returnResult = (
        <Button
          style={{ width: '10%', backgroundColor: '#135A8D', color: '#FFFFFF' }}
          onClick={event}
        >
          {text}
        </Button>
      );
      // 授权按钮
    } else if (type == 'Authorization') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="user"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="user"
            size="small"
            style={{ backgroundColor: '#DB6262', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }

      // 上传按钮
    } else if (type == 'Upload') {
      returnResult = (
        <Button style={{ color: '#DB5F5F' }} onClick={event}>
          {text}
        </Button>
      );
      // 驳回按钮
    } else if (type == 'TurnDown') {
      if (disabled) {
        returnResult = (
          <Button onClick={event} disabled style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            style={{ background: '#FFFFFF', color: '#2EAEF7', border: '1px solid #2EAEF7' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 审批通过按钮
    } else if (type == 'Approve') {
      if (disabled) {
        returnResult = (
          <Button onClick={event} disabled style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button style={{ background: '#2EAEF7', color: '#FFFFFF' }} onClick={event}>
            {text}
          </Button>
        );
      }

      // 保存按钮
    } else if (type == 'Save') {
      if (disabled) {
        returnResult = (
          <Button
            style={{ background: '#ACACAC', color: '#FFFFFF', border: '1px solid #2EAEF7' }}
            onClick={event}
            disabled
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            style={{ background: '#FFFFFF', color: '#2EAEF7', border: '1px solid #2EAEF7' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 保存并提交按钮
    } else if (type == 'SaveAndCommit') {
      if (disabled) {
        returnResult = (
          <Button style={{ background: '#ACACAC', color: '#FFFFFF' }} onClick={event} disabled>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button style={{ background: '#2EAEF7', color: '#FFFFFF' }} onClick={event}>
            {text}
          </Button>
        );
      }
      // 重置密码按钮
    } else if (type == 'ResetPassword') {
      returnResult = (
        <Button style={{ background: '#2EAEF7', color: '#FFFFFF' }} onClick={event}>
          {text}
        </Button>
      );
    } else if (type == 'CloseButton') {
      returnResult = (
        <Button style={{ background: '#2EAEF7', color: '#FFFFFF' }} onClick={event}>
          {text}
        </Button>
      );
    } else if (type == 'ChangeStatus') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="poweroff"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="poweroff"
            size="small"
            style={{ backgroundColor: 'red', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'consultation') {
      //咨询按钮
      if (disabled) {
        returnResult = (
          <Button
            icon="message"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
            disabled
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="message"
            size="small"
            style={{ backgroundColor: '#51D5AC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'Settlement') {
      //结算按钮
      if (disabled) {
        returnResult = (
          <Button
            icon="account-book"
            size="small"
            style={{ backgroundColor: '#FFCC66', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="account-book"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
            disabled
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'Sure') {
      //确认
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="user"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="user"
            size="small"
            style={{ backgroundColor: '#57B5E3', color: '#FFFFFF' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'Operated') {
      if (disabled) {
        returnResult = (
          <Button
            disabled
            icon="poweroff"
            size="small"
            style={{ backgroundColor: '#ACACAC', color: '#FFFFFF', cursor: 'default' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            icon="poweroff"
            size="small"
            style={{ backgroundColor: 'red', color: '#FFFFFF', cursor: 'default' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'Collected') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#FFFFFF', color: '#ACACAC' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button style={{ backgroundColor: '#FFFFFF', color: '#ACACAC' }} onClick={event}>
            {text}
          </Button>
        );
      }
    } else if (type == 'Collect') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#FFFFFF', color: '#2EAEF7' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            style={{ backgroundColor: '#FFFFFF', color: '#2EAEF7', borderColor: '#2EAEF7' }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 上架下架
    } else if (type == 'Stop') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#cccccc', color: '#2EAEF7' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            size="small"
            style={{
              backgroundColor: '#666666',
              color: '#ffffff',
              borderColor: '#666666',
              padding: '0px 15px',
            }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'Shelf') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#cccccc', color: '#2EAEF7' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            size="small"
            style={{
              backgroundColor: '#00BFBF',
              color: '#ffffff',
              borderColor: '#00BFBF',
              padding: '0px 15px',
            }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    } else if (type == 'NoStop') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#cccccc', color: '#2EAEF7' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            size="small"
            style={{
              backgroundColor: '#FF0000',
              color: '#ffffff',
              borderColor: '#FF0000',
              padding: '0px 15px',
            }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
      // 订单详情查看
    } else if (type == 'OrderView') {
      if (disabled) {
        returnResult = (
          <Button disabled style={{ backgroundColor: '#FFFFFF', color: '#1890FF' }} onClick={event}>
            {text}
          </Button>
        );
      } else {
        returnResult = (
          <Button
            size="small"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1890FF',
              borderColor: '#FFFFFF',
              padding: '0px 15px',
            }}
            onClick={event}
          >
            {text}
          </Button>
        );
      }
    }
    return returnResult;
  }
}

export default ButtonOptionComponent;
