import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 合同
  'GET /business/contract/:orderNumber': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: null,
      data: {
        contract:
        {
          extraItem: ''
        },
      },
    });
  },

  // 合同
  'PUT /business/contract': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: null,
      data: '222',
    });
  },


  //取消预订单
  'DELETE /business/order/:guid': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },


  //取消预订单
  'PUT /business/order': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: null,
      data: 'abc',
    });
  },
};
