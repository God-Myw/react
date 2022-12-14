import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    // GET POST 可省略 TODO Smple
    'PUT /business/order/review': (req: Request, res: Response) => {
      res.send({
        code: '0',
        message: 'OK',
        status: 200,
        data:'662',
      });
    },
};
