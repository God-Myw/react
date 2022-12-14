import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array  TODO Smple
  'GET /sys/user/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        userDataChecks: [
          {
            id: '1',
            companyName: 'XXX',
            companyTelephone: '86-1523658955',
            userType: 5,
            faxNumber: '0517-5354875',
            bankType: '农业银行',
            bankNumber: '5423558654251251245',
            status: '1',
          },
          {
            id: '2',
            companyName: 'XXX',
            companyTelephone: '86-1523658955',
            userType: 4,
            faxNumber: '0517-5354875',
            bankType: '农业银行',
            bankNumber: '5423558654251251245',
            status: '2',
          },
        ],
      },
    });
  },

  //根据ID查询用户
  'GET /sys/user/:id/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        userDataCheck: {
          id: '1111',
          companyName: '大型物流海运有限公司',
          companyTelephone: '86-11111111111',
          faxNumber: '0517-231232423',
          address: '中华人民共和国,江苏省,苏州市,相城区,澄中路',
          bankType: '农业银行',
          bankNumber: '23111123123123123',
          status: '0',
          checkRemark: '这个很不错',
          userType: 4,
          fileUpURLs: [
            {
              picName: '营业执照',
              fileUpURL:
                'https://c-ssl.duitang.com/uploads/item/201303/28/20130328121141_REKaF.thumb.700_0.jpeg',
              time: '永久有效',
            },
            {
              picName: '船东互保证书P&I',
              fileUpURL:
                'https://c-ssl.duitang.com/uploads/item/201303/28/20130328121141_REKaF.thumb.700_0.jpeg',
              time: '',
            },
            {
              picName: '船舶登记证书certificate of registry',
              fileUpURL:
                'https://c-ssl.duitang.com/uploads/item/201303/28/20130328121141_REKaF.thumb.700_0.jpeg',
              time: '',
            },
            {
              picName: '船公司安全管理符合证明 DOC',
              fileUpURL:
                'https://c-ssl.duitang.com/uploads/item/201303/28/20130328121141_REKaF.thumb.700_0.jpeg',
              time: '',
            },
            {
              picName: '船舶安全管理证书 SMC',
              fileUpURL:
                'https://c-ssl.duitang.com/uploads/item/201303/28/20130328121141_REKaF.thumb.700_0.jpeg',
              time: '',
            },            
          ],
        },
      },
    });
  },

  'PUT /sys/user/:id/data': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },
};
