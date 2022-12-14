import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询货盘列表
  'GET /business/parttrade': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        parttrade: [
          {
            guid: 1,
            tradeType: 0,
            partName: 'A',
            partModel: 1,
            partCount: 1,
            drawingNumber: 1,
            partNumber: 1,
          },
          {
            guid: 1,
            tradeType: 1,
            partName: 'B',
            partModel: 1,
            partCount: 1,
            drawingNumber: 1,
            partNumber: 1,
          },
          {
            guid: 1,
            tradeType: 0,
            partName: 'C',
            partModel: 1,
            partCount: 1,
            drawingNumber: 1,
            partNumber: 1,
          },
        ],
      },
    });
  },

  //根据ID查询货盘
  'GET /business/parttrade/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        parttrade: {
          guid: 1,
          tradeType: 0,
          partName: 'GTX1B',
          partModel: '备件型号1',
          partCount: 15,
          drawingNumber: '图纸号1',
          partNumber: '备件号1',
        },
      },
    });
  },
};
