import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询角色列表
  'GET /sys/role': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        roles: [
          {
            id:'2122',           
            roleName: 'XXX',
            type:'0',
            status:'0',
            creater:'张三',
            createDate:'2019/12/09',
            updateDate:'2019/12/12',
            updater:'张三',
            deleteFlag:'0',
          },
          {
            id:'2125',           
            roleName: 'XXX',
            type:'0',
            status:'0',
            creater:'张三',
            createDate:'2019/12/09',
            updateDate:'2019/12/12',
            updater:'张三',
            deleteFlag:'0',
          },
          {
            id:'2123',           
            roleName: 'XXX',
            type:'0',
            status:'0',
            creater:'张三',
            createDate:'2019/12/09',
            updateDate:'2019/12/12',
            updater:'张三',
            deleteFlag:'1',
          },
        ],
      },
    });
  },

  //根据ID查询角色
  'GET /sys/role/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        role: {
         guid:'159753456852',
         roleName:'路飞',
         creater:'龙',
         createDate:'2000/01/01',
         updater:'卡普',
         updateDate:'2010/01/01',
        },
      },
    });
  },

  //根据ID删除角色
  'DELETE /sys/role/:id': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },
};
