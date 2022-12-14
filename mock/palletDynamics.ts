import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询货盘列表
  'GET /business/pallet': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        pallets: [
          {
            guid: 1,
            goodsLevel: 1,
            goodsType: 1,
            goodsCount: 1,
            startPort: 1,
            destinationPort: 1,
            goodsQuality: 1,
            isSuperposition: 1,
          },
        ],
      },
    });
  },

  //根据ID查询货盘
  'GET /business/pallet/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        pallet: {
          goodsLevel: 1,
          goodsSubLevel: 1,
          goodsType: 2,
          goodsWeight: 3,
          goodsVolume: 4,
          goodsCount: 5,
          isSuperposition: 6,
          startPort: 7,
          destinationPort: 7,
          loadDate: '2019-11-26',
          endDate: '2019-11-26',
          lessPackingRate: '25',
          unpackingRate: '40',
          fileName:'货物清单',
          majorParts:0,
          goodsProperty:0,
          location:1,
          fillType:2,
        },
      },
    });
  },
};
