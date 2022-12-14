import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /business/shipTrade': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        currentPage: 1,
        total: 3,
        shipTrades: [
          {
            guid: 1,
            phoneCode: '86',
            phoneNumber: '12341234123',
            contacter: 'xiaoxiao',
            remark: '其它',
            state: 0,
            status: 1,
            emergencyLevel: 1,
            shipType: 3,
            tradeType: 2,
            tonNumber: 1000.2,
            shipAge: 2,
            classificationSociety: 4,
            voyageArea: 4,
            createDate: '2019-11-23T03:42:00.000+0000',
            creater: 0,
            updateDate: '2019-11-23T03:20:51.000+0000',
            updater: 0,
            deleteFlag: 0,
            email: '22@qq.com',
            userName: 'abc',
          },
          {
            guid: 2,
            phoneCode: '86',
            phoneNumber: '12341234123',
            contacter: 'xiaoxiao',
            remark: '其它',
            state: 1,
            status: 0,
            emergencyLevel: 1,
            shipType: 3,
            tradeType: 2,
            tonNumber: 1000.2,
            shipAge: 2,
            classificationSociety: 4,
            voyageArea: 4,
            createDate: '2019-11-23T03:42:00.000+0000',
            creater: 0,
            updateDate: '2019-11-23T03:20:51.000+0000',
            updater: 0,
            deleteFlag: 0,
            email: '22@qq.com',
            userName: 'abc',
          },
          {
            guid: 3,
            phoneCode: '86',
            phoneNumber: '12341234123',
            contacter: 'xiaoxiao',
            remark: '其它',
            state: 1,
            status: 0,
            emergencyLevel: 1,
            shipType: 3,
            tradeType: 2,
            tonNumber: 1000.2,
            shipAge: 2,
            classificationSociety: 4,
            voyageArea: 4,
            createDate: '2019-11-23T03:42:00.000+0000',
            creater: 0,
            updateDate: '2019-11-23T03:20:51.000+0000',
            updater: 0,
            deleteFlag: 0,
            email: '22@qq.com',
            userName: 'abc',
          },
        ],
      },
    });
  },
  //详情信息
  'GET /business/shipTrade/1': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        shipTrade: {
          guid: 1,
          phoneCode: '86',
          phoneNumber: '13800000000',
          contacter: 'xiaoxiao',
          remark: '其它',
          state: 0,
          status: 0,
          emergencyLevel: 1,
          shipType: 3,
          tradeType: 2,
          tonNumber: 1000,
          shipAge: 2,
          classificationSociety: 2,
          voyageArea: 4,
          createDate: '2019-11-23T03:41:57.000+0000',
          creater: 0,
          updateDate: '2019-11-23T03:13:00.000+0000',
          updater: 0,
          deleteFlag: 0,
          email: '22@qq.com',
          userName: 'abc',
        },
      },
    });
  },
  //详情信息
  'GET /business/shipTrade/2': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        shipTrade: {
          guid: 1,
          phoneCode: '86',
          phoneNumber: '13800000000',
          contacter: 'xiaoxiao',
          remark: '其它',
          state: 0,
          status: 1,
          emergencyLevel: 1,
          shipType: 3,
          tradeType: 2,
          tonNumber: 1000,
          shipAge: 2,
          classificationSociety: 2,
          voyageArea: 4,
          createDate: '2019-11-23T03:41:57.000+0000',
          creater: 0,
          updateDate: '2019-11-23T03:13:00.000+0000',
          updater: 0,
          deleteFlag: 0,
          email: '22@qq.com',
          userName: 'abc',
        },
      },
    });
  },

  // 修改保存
  'PUT /business/shipTrade': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 新增
  'POST /business/shipTrade': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 删除
  'DELETE /business/shipTrade/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },

  'PUT /business/shipTrade/status': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
};
