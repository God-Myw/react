import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询航次列表
  'GET /business/voyage': (req: Request, res: Response) => {
    if (req.param('type') !== '1') {
      res.send({
        code: '0000',
        message: 'OK',
        status: 200,
        data: {
          total: 6,
          voyages: [
            {
              guid: 1,
              shipName: '蒙拉丽莎号1',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
            {
              guid: 2,
              shipName: '蒙拉丽莎号2',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
            {
              guid: 3,
              shipName: '蒙拉丽莎号3',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
            {
              guid: 1,
              shipName: '蒙拉丽莎号4',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
            {
              guid: 2,
              shipName: '蒙拉丽莎号5',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
            {
              guid: 3,
              shipName: '蒙拉丽莎号6',
              shipType: '散货船',
              acceptTon: 9999,
              voyageName: '西美',
              shipCrane: '4*30mts+12cbm grab',
              shipDeck: '单甲板',
              shipVoyage: 7888,
            },
          ],
        },
      });
    } else if (req.param('type') === '1') {
      res.send({
        data: {
          total: 2,
          voyages: [
            {
              acceptCapacity: 99.0,
              shipType: 1,
              voyageLineName: '天舟线',
              guid: 1,
              state: 0,
              shipName: '大辽宁号k',
              acceptTon: 9999999.0,
              shipVoyage: 999.0,
            },
            {
              acceptCapacity: 99.0,
              shipType: 1,
              voyageLineName: '天舟线',
              guid: 2,
              state: 1,
              shipName: 'lkd',
              acceptTon: 9999999.0,
              shipVoyage: 9919.0,
            },
          ],
          currentPage: 1,
        },
        code: '0000',
        message: '执行成功!',
        status: 200,
      });
    }
  },

  //根据ID查询航次
  'GET /business/voyage/:id': (req: Request, res: Response) => {
    res.send({
      data: {
        voyageLineName: '舟山线',
        ship: {
          guid: 134,
          shipName: '测试船名3',
          buildParticularYear: '2019',
          tonNumber: 0e-10,
          draft: 0e-10,
          shipDeck: 0,
          capacity: 0e-10,
          shipCrane: '1',
          anchoredPort: 1,
          classificationSociety: 0,
          voyageArea: 0,
          expireDate: '2019-12-11T05:28:51.000+0000',
          shipType: 0,
          checkStatus: 0,
          status: 1,
          state: 1,
          createDate: '2019-12-09T10:02:51.000+0000',
          creater: 6,
          updateDate: '2019-12-09T10:02:51.000+0000',
          updater: 6,
          deleteFlag: 0,
          pmiDeadline: 0,
          endTime: '1970-01-01T00:00:02.000+0000',
          startTime: '1970-01-01T00:00:02.000+0000',
          imo: 9665695,
        },
        voyagePort: [
          {
            portTypeName: '起始港',
            portName: '宁波港',
            arriveDate: '1574668514000',
            leaveDate: '1574668514000',
            viaId: 1,
            voyageId: 34,
          },
          {
            portTypeName: '第一目的港',
            portName: '上海港',
            arriveDate: '1574668514000',
            leaveDate: '1574668514000',
            viaId: 2,
            voyageId: 34,
          },
          {
            portTypeName: '第二目的港',
            portName: '天津港',
            arriveDate: '1574668514000',
            leaveDate: '1574668514000',
            viaId: 3,
            voyageId: 34,
          },
        ],
        voyage: {
          guid: 34,
          shipId: 134,
          shipVoyage: 9919.0,
          acceptTon: 9999999.0,
          acceptCapacity: 99.0,
          voyageLineId: 1,

          voyageStartPort: 1,
          expectStartDate: '2019-12-16T07:32:59.000+0000',
          contacter: '林test',
          phoneCode: '+86',
          contactPhone: '1234567890',
          status: 0,
          matchStatus: 0,
          matchStopStatus: 0,
          state: 1,
          trackServiceId: 2,
          createDate: '2019-12-16T07:28:58.000+0000',
          creater: 6,
          updateDate: '2019-12-16T07:28:58.000+0000',
          updater: 6,
          deleteFlag: 0,
        },
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  },

  'POST /business/voyage': (req: Request, res: Response) => {
    res.send({
      code: '0000',
      message: '执行成功!',
      status: 200,
      data: {},
    });
  },

  'PUT /business/voyage': (req: Request, res: Response) => {
    res.send({
      code: '0000',
      message: '执行成功!',
      status: 200,
      data: {},
    });
  },

  'DELETE /business/voyage/:id': (req: Request, res: Response) => {
    res.send({
      code: '0000',
      message: '执行成功!',
      status: 200,
      data: {},
    });
  },
};
