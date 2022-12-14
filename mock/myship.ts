import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询船舶列表
  'GET /business/ship': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        ships: [
          {
            guid: 1,
            shipName: '蒙娜丽莎号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: 2,
            shipName: '泰坦尼克号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: 3,
            shipName: '万里阳光号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: 4,
            shipName: '雷德佛斯号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '5',
            shipName: '莫比迪克号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '6',
            shipName: '奥罗杰克逊号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '7',
            shipName: '九蛇号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '8',
            shipName: '恐怖三桅帆船',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '9',
            shipName: '黄金梅丽号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '10',
            shipName: '布里基克号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '11',
            shipName: '性感狐狸号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '12',
            shipName: '约塔玛利亚号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
          {
            guid: '13',
            shipName: '圣歌号',
            shipType: 1,
            shipDeck: 1,
            shipCrane: '4*30mt+150mts',
            voyageArea: 1,
            classificationSociety: 1,
            shipAge: '1',
            state: 2,
          },
        ],
      },
    });
  },

  // 新增船舶
  'POST /business/ship': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },

  // 修改船舶
  'PUT /business/ship': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },

  //根据ID查询船舶
  'GET /business/ship/:id': (req: Request, res: Response) => {
    res.send({
      data: {
        ship: {
          guid: 120,
          shipName: 'lkd',
          shipFlag: 1,
          buildParticularYear: '2018',
          tonNumber: 1111,
          draft: 111,
          shipDeck: 1,
          capacity: 11,
          hatch: 11,
          hatchSize: 1,
          shipCrane: '11',
          anchoredPort: 11,
          classificationSociety: 1,
          voyageArea: 3,
          expireDate: '2019-12-10T05:46:47.000+0000',
          shipType: 1,
          remark: '1',
          checkStatus: 1,
          status: 1,
          state: 0,
          createDate: '2019-11-30T07:37:06.000+0000',
          creater: 1,
          updateDate: '2019-11-30T15:32:28.000+0000',
          updater: 1,
          deleteFlag: 0,
          pmiDeadline: 1,
          endTime: '2019-11-30T15:32:42.000+0000',
          startTime: '2019-11-30T15:32:39.000+0000',
          imo: 0,
          mmsi: 0,
          charterWay: 0,
        },
        shipChecks: {
          checkRemark: '船舶过期',
        },
        picList: [
          {
            fileName: 'test.png',
            type: '1',
            fileLog: '10',
          },
          {
            fileName: 'test.png',
            type: '2',
            fileLog: '5',
          },
          {
            fileName: 'test.png',
            type: '3',
            fileLog: '13',
          },
          {
            fileName: 'test.png',
            type: '3',
            fileLog: '13',
          },
        ],
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  },

  //根据ID删除船舶
  'DELETE /business/ship/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },
};
