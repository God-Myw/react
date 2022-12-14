import PageLoading from '@/components/PageLoading';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import { Redirect } from 'umi';
import Authorized from './Authorized';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
}

interface SecurityLayoutState {
  isReady: boolean;
}

type SecurityProps = RouteComponentProps & SecurityLayoutProps;

class SecurityLayout extends React.Component<SecurityProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { location, children, loading } = this.props;

    const token = localStorage.getItem('token');

    if ((!token && loading) || !isReady) {
      return <PageLoading />; 
    }
    if (!token) {
      return <Redirect to="/user/login"></Redirect>;
    } else {
      return <Authorized to={location.pathname} children={children} />;
    }
    // return children;
  }
}

export default connect(({ loading }: ConnectState) => ({
  loading: loading.models.user,
}))(SecurityLayout);
