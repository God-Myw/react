import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /sys/user/:id/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        userDataCheck: {
          id: '1',
          companyName: '任天堂',
          companyTelephone: '123123213',
          faxNumber: '1232131',
          companyAddress: '111广场',
          bankType: '泰州杀鸡银行',
          bankNumber: '21321sad124121',
          type: '0',
          status: '0',
          checkRemark: '未通过',
          fileUpURLs: [{
            fileName: 'aaa',
            fileType: 1,
            fileLog: 1,
            endTime: '2018/06/13',
          },
          {
            fileName: 'aaa',
            fileType: 1,
            fileLog: 6,
            endTime: '2018/06/13',
          }, {
            fileName: 'aaa',
            fileType: 1,
            fileLog: 7,
            endTime: '2018/06/13',
          },
          {
            fileName: 'aaa',
            fileType: 1,
            fileLog: 9,
            endTime: '2018/06/13',
          }]
        },
      },
    });
  },
  // 新增保存
  'POST /sys/user/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 修改保存
  'PUT /sys/user/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
};
