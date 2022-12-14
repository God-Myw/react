import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {

  'POST /business/earnestMoney': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'adas',
    });
  },

  // 预订单list
  'GET /business/earnestMoney': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
          money:'500.00',
          checkStatus:'0',
          picList: [
          {
            fileName:'fileName',
            fileType:'sada',
            fileLog:'asda',
          },
        ],
      },
    });
  },
};
