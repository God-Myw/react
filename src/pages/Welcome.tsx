import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, Card } from 'antd';
import React from 'react';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="这里放置提示信息，比如您有新的订单等等信息。"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
    </Card>
  </PageHeaderWrapper>
);
