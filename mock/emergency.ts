import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /business/emergency': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      total: 17,
      data: {
        emergencys: [
          {
            guid: 1,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx1',
            status: 0,
            state: 0,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:21.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:21.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 2,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 3,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 4,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 5,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 6,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 7,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 8,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 9,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 10,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 11,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 12,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 13,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 14,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 15,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 16,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 17,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 18,
            requestTitle: '需要吊车',
            requestContent: '吊车xxxx2',
            status: 1,
            state: 1,
            emergencyLevel: 1,
            createDate: '2019-11-23T10:38:35.000+0000',
            creater: 0,
            updateDate: '2019-11-23T10:38:35.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
        ],
      },
    });
  },
  // 新增保存
  'POST /business/emergency': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  //获取详情
  'GET /business/emergency/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        emergency: {
          guid: 1,
          requestTitle: '需要吊车',
          requestContent: '吊车xxxx1',
          status: 1,
          state: 1,
          emergencyLevel: 1,
          createDate: '2019-11-23T10:38:21.000+0000',
          creater: 0,
          updateDate: '2019-11-23T10:38:21.000+0000',
          updater: 0,
          deleteFlag: 0,
        },
      },
    });
  },
  // 修改保存
  'PUT /business/emergency': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  //获取详情
  'DELETE /business/emergency/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },

  //线上客服关闭需求
  'PUT /business/emergency/close': (re: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
};
