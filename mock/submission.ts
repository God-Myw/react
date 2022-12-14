import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /business/order/uploadBill': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },


  'GET /business/ordera': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        orders:[
          {
            guid: 1,
            orderNumber: "1111eqw12",
            shipName:'万里',
            shipType:1,
            orderStatus: 0,
            payStatus: 0,
            goodsLevel: 1,
            goodsType: 3,
            goodsCount:'11',
            loadDate:'2019',
          },
          {
            guid: 2,
            orderNumber: "11111rqq2",
            shipName:'万里1',
            shipType:1,
            orderStatus: 0,
            payStatus: 0,
            goodsLevel: 1,
            goodsType: 3,
            goodsCount:'11',
            loadDate:'2019',
          },
          {
            guid: 3,
            orderNumber: "1111wqe12",
            shipName:'万里2',
            shipType:1,
            orderStatus: 0,
            payStatus: 0,
            goodsLevel: 1,
            goodsType: 3,
            goodsCount:'11',
            loadDate:'2019',
          },
        ]
      }
    });
  },
};
