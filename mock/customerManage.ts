import { Request, Response } from 'express';

const getcustomerList = (req: Request, res: Response) => {
  if (req.param('type')) {
    if (req.param('currentPage') == '1') {
      res.send({
        message: 'OK',
        code: 200,
        data: {
          currentPage: 1,
          total: 15,
          users: [
            {
              guid: 1,
              accountId: '1001',
              userType: '线上客服',
              firstName: '张',
              lastName: '三',
              belongPort: '上海港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 2,
              accountId: '1002',
              userType: '线上客服',
              firstName: '李',
              lastName: '四',
              belongPort: '上海港',
              phone: '18000000000',
              passWord: '********',
              status: '冻结',
            },
            {
              guid: 3,
              accountId: '1003',
              userType: '线上客服',
              firstName: '老',
              lastName: '王',
              belongPort: '上海港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 4,
              accountId: '1004',
              userType: '线上客服',
              firstName: '李',
              lastName: '四',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 5,
              accountId: '1004',
              userType: '线上客服',
              firstName: '李',
              lastName: '白',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
          ],
        },
      });
    } else if (req.param('currentPage') == '2') {
      res.send({
        message: '执行成功',
        code: null,
        data: {
          currentPage: 2,
          total: 15,
          dictTypes: [
            {
              guid: 1,
              accountId: '1004',
              userType: '线上客服',
              firstName: '王',
              lastName: '五',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 2,
              accountId: '1004',
              userType: '线上客服',
              firstName: '李',
              lastName: '奎',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 3,
              accountId: '1004',
              userType: '线上客服',
              firstName: '陈',
              lastName: '四',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 4,
              accountId: '1004',
              userType: '线上客服',
              firstName: '吴',
              lastName: '三',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
            {
              guid: 5,
              accountId: '1005',
              userType: '线上客服',
              firstName: '郑',
              lastName: '三',
              belongPort: '泉州港',
              phone: '18000000000',
              passWord: '********',
              status: '启用',
            },
          ],
        },
      });
    }
  }
};

//新增
const addService = (req: Request, res: Response) => {
  res.send({
    code: '200',
    message: '添加成功',
    data: null,
  });
};

//删除
const deleteService = (req: Request, res: Response) => {
  res.send({
    code: '200',
    message: '删除成功',
    data: null,
  });
};
//修改
const putService = (req: Request, res: Response) => {
  res.send({
    code: '200',
    message: '修改成功',
    data: null,
  });
};
//重置密码
const ResetService = (req: Request, res: Response) => {
  res.send({
    code: '200',
    message: '重置成功',
    data: null,
  });
};

export default {
  'GET /sys/customerManage': getcustomerList,
  'POST /sys/customerManage': addService,
  'DELETE /sys/customerManage/:id': deleteService,
  'PUT /sys/customerManage': putService,
  'GET /sys/reset/': ResetService,
};
