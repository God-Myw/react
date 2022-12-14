import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /sys/insuranceCompany': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        total: 2,
        insuranceCompanys: [
          {
            guid: 1,
            companyNameCn: '太平洋保险',
            companyCode: '123',
            rate: '3',
            contacter: '123',
            contactPhone: '123',
            address: '123',
          },
          {
            guid: 2,
            companyNameCn: '中国航天科技',
            companyCode: '啊哈',
            rate: '0.02',
            contacter: '昂杠',
            contactPhone: '1111122222',
            address: '456',
          },
        ],
        currentPage: 1,
      },
    });
  },
  //详情信息
  'GET /sys/insuranceCompany/1': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        guid: 1,
        companyNameCn: '太平洋保险',
        companyCode: '123',
        contacter: '123',
        contactPhone: '123',
        address: '123',
        rate: '0.02',
      },
    });
  },
  // 修改保存
  'PUT /sys/insuranceCompany': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 新增
  'POST /sys/insuranceCompany': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
  // 删除
  'DELETE /sys/insuranceCompany/1': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: '',
    });
  },
};
