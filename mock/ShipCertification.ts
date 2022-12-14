import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  
  'GET /business/ship/shipCheck/:guid': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        ship: {
          shipName: '蒙娜丽莎',//船名
          buildParticularYear: '2019/10/10',//建造年份
          tonNumber: '123',//吨位
          draft: '123',//吃水
          shipDeck: '单甲板',//船甲板
          capacity: '123',//仓容
          anchoredPort: '天津港',//挂靠港口
          shipType: '货船',//船舶类型
          checkStatus: '0',//审核状态
          shipCrane: '4*30mt+150mts',//船吊
          pmiDeadline: '一年',//PMI期限
          endTime: '2019/01/01',//PMI截至时间
          startTime: '2019/01/01',//PMI起始时间
          registryDeadline: '一年',//船舶登记证书期限
          registryStartTime: '2019/01/01',//起始时间
          registryEndTime: '2019/01/01',//截止时间
          imo: '123',//IMO
          mmsi: '123',//MMSI
          charterWay: '航次租期',//租船方式
          voyageArea: '内河',//航区
          classificationSociety: '中国船级社CSS',//船级社
        },
        picList: [
          {
            type: '1',
            fileName: 'fileName',
            fileLog: '4',
          },
          {
            type: '1',
            fileName: 'fileName',
            fileLog: '5',
          },
          {
            type: '1',
            fileName: 'fileName',
            fileLog: '13',
          },
          {
            type: '1',
            fileName: 'fileName',
            fileLog: '13',
          }
        ],
        shipChecks:{
          checkRemark:'asdasda',
        },
      },
    });
  },

  'POST /business/ship/shipCheck': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },
};
