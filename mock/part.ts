import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /business/part': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        total: 3,
        parts: [
          {
            guid: 1,
            partName: 'GTX1B',
            tradeType: 1,
            partModel: '备件型号1',
            drawingNumber: '图纸号1',
            partCount: 15,
            partNumber: '备件号1',
            contacter: 'xiaoxiao',
            phoneCode: '86',
            phoneNumber: '12345612345',
            state: 0,
            status: 0,
            emergencyLevel: 1,
            remark: '其它',
            createDate: '2019-11-23T09:08:14.000+0000',
            creater: 0,
            updateDate: '2019-11-23T09:08:14.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 2,
            partName: 'GTX1B',
            tradeType: 0,
            partModel: '备件型号1',
            drawingNumber: '图纸号1',
            partCount: 15,
            partNumber: '备件号1',
            contacter: 'xiaoxiao',
            phoneCode: '86',
            phoneNumber: '12345612345',
            state: 1,
            status: 0,
            emergencyLevel: 1,
            remark: '其它',
            createDate: '2019-11-23T09:08:14.000+0000',
            creater: 0,
            updateDate: '2019-11-23T09:08:14.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
          {
            guid: 3,
            partName: 'GTX1B',
            tradeType: 0,
            partModel: '备件型号1',
            drawingNumber: '图纸号1',
            partCount: 15,
            partNumber: '备件号1',
            contacter: 'xiaoxiao',
            phoneCode: '86',
            phoneNumber: '12345612345',
            state: 1,
            status: 0,
            emergencyLevel: 1,
            remark: '其它',
            createDate: '2019-11-23T09:08:14.000+0000',
            creater: 0,
            updateDate: '2019-11-23T09:08:14.000+0000',
            updater: 0,
            deleteFlag: 0,
          },
        ],
        currentPage: 1,
      },
    });
  },
  //详情信息
  'GET /business/part/1': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        part: {
          partName: 'GTX1B',
          tradeType: 2,
          partModel: '备件型号1',
          drawingNumber: '图纸号1',
          partCount: 15,
          partNumber: '备件号1',
          contacter: 'xiaoxiao',
          phoneCode: '86',
          phoneNumber: '13800000000',
          remark: '其它',
        },
      },
    });
  },
  // 修改保存
  'PUT /business/part': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 新增
  'POST /business/part': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 删除
  'DELETE /business/part/1': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
};
