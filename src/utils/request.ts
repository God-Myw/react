/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import { isNil } from 'lodash';
import { extend } from 'umi-request';
import { async } from 'q';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '令牌错误（可能在其他地方登录）',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (status === 401) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
      const userType = String(localStorage.getItem('userType'));
      if (userType === '5' || userType === '4') {
        window.location.href = `/user/login`; // 回到登录画面
      } else if (userType === '0') {
        window.location.href = `/user/admin/login`; // 回到登录画面
      } else if (userType === '1' || userType === '2' || userType === '3') {
        window.location.href = `/user/service/login`; // 回到登录画面
      }
    }
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const getRquest = () => {
  return extend({
    errorHandler,
    // prefix: '/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      token: String(localStorage.getItem('token') ? localStorage.getItem('token') : ''),
    },
  });
};

export const getRequest = (
  url: string,
  params: Map<string, string>,
  e: (response: any) => void,
  pageInfo?: {
    currentPage: number;
    pageSize: number;
  },
) => {
  const request = getRquest();
  localStorage.getItem('token');
  if (pageInfo && url.indexOf('/list') != 0) {
    params.set('currentPage', pageInfo.currentPage.toString());
    params.set('pageSize', pageInfo.pageSize.toString());
  }
  url = url.concat('?randomUUID=' + String(Math.random()*100)+'&');
  if (!isNil(params) && params.size > 0) {
    params.forEach((value, key, params) => {
      url = url
        .concat(key)
        .concat('=')
        .concat(encodeURIComponent(value))
        .concat('&');
    });
  }

  async(request.get('/api' + url).then(e));
};

export const postRequest = (url: string, data: string, e: (response: any) => void) => {
  const request = getRquest();
  request
    .post('/api' + url, {
      data,
    })
    .then(e);
};
export const putRequest = (url: string, data: string, e: (response: any) => void) => {
  const request = getRquest();
  request
    .put('/api' + url, {
      data,
    })
    .then(e);
};
export const deleteRequest = (url: string, params: Map<string, string>, e: (response: any) => void) => {
  const request = getRquest();
  if (!isNil(params) && params.size > 0) {
    url = url.concat('?');

    params.forEach((value, key, params) => {
      url = url
        .concat(key)
        .concat('=')
        .concat(value)
        .concat('&');
    });
  }
  request.delete('/api' + url).then(e);
};

export default getRequest;
