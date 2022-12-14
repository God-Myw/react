import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询货盘列表
  'GET /business/order': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        total: 3,
        orders: [
          {
            voyageName: "lkd天舟线",
            voyageId: 12,
            grantedUserId:4,
            orderDto: [
              {
                guid: 1,
                orderNumber: "111112",
                orderStatus: 0,
                payStatus: 0,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 0,
              },
              {
                guid: 2,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 0,
                payStatus: 1,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 0,
              },
              {
                guid: 3,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 0,
                payStatus: 1,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 1,
              },
              {
                guid: 4,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 1,
                payStatus: 1,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 1,
              },
              {
                guid: 5,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 1,
                payStatus: 2,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 1,
              },
              {
                guid: 6,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 2,
                payStatus: 2,
                goodsLevel: 0,
                goodsType: 3,
                deliverStatus: 1,
              }
            ]
          },{
            voyageName: "test1线",
            voyageId: 1,
            grantedUserId:6,
            orderDto: [
              {
                guid: 1,
                orderNumber: "111112",
                orderStatus: 0,
                payStatus: 0,
                goodsLevel: 1,
                goodsType: 3,
                deliverStatus: 0
              },
              {
                guid: 11,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 0,
                payStatus: 0,
                goodsLevel: 1,
                goodsType: 3,
                deliverStatus: 0
              }
            ]
          },{
            voyageName: "测试3线",
            voyageId: 3,
            grantedUserId:2,
            orderDto: [
              {
                guid: 3,
                orderNumber: "111112",
                orderStatus: 0,
                payStatus: 0,
                goodsLevel: 1,
                goodsType: 3,
                deliverStatus: 0
              },
              {
                guid: 13,
                orderNumber: "DYWLHY201911291554194A",
                orderStatus: 0,
                payStatus: 0,
                goodsLevel: 1,
                goodsType: 3,
                deliverStatus: 0
              }
            ]
          }
        ],
      },
    });
  },

  // 定金，尾款审核
  'PUT /business/order/billReview': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },

  // 订单结算
  'PUT /business/order/settlement': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: 'abc',
    });
  },

  //根据ID查询货盘
  'GET /business/order/:id': (req: Request, res: Response) => {
    if (req.param('type') == '1') {
      res.send({
        code: '0',
        message: 'OK',
        status: 200,
        data: {
          checkRemark: '54545',
          attachments: [
            {
              type: '1',
              fileName: 'fileName',
              fileLog: 11,
            },
            {
              type: '1',
              fileName: 'fileName',
              fileLog: 12,
            },
            {
              type: '1',
              fileName: 'fileName',
              fileLog: 12,
            },
            {
              type: '1',
              fileName: 'fileName',
              fileLog: 16,
            },
            {
              type: '1',
              fileName: 'fileName',
              fileLog: 2,
            }
          ],
          order: {
            guid: '1454',
            contractMoney: 1050.00,
            downpayment: 235.00,
            orderType:'1',
            orderPeople:'王五',
            phone:'15324444444',
            orderNumber:'152545',
            orderTime:'1577102268',
          },
          orderVoyage: {
            voyageLineName:'美西线',
            ship: {
              shipName: '万里阳光号',//船舶名称
              buildParticularYear: '1995/08/08',//建造年份
              tonNumber: '9999',//吨位
              draft: '9999',//吃水
              shipDeck: 1,//船型
              capacity: '9999',//船容
              shipType: 1,//船舶类型
              shipCrane: '4*30mt+150mts',//船吊
            },
            voyage: {
              shipVoyage: '8',//航程
              acceptTon: '999',//可接受吨位
              acceptCapacity: '666666',//可接受容积
              voyageLineId: '215212',//航线主键
              voyageStartPort: 1,//预计停留港口
              phoneCode: '+86',//手机号段
              contacter: '张三',//联系人
              contactPhone: '15555555551',//联系电话
            },
            voyagePort: [
              {
                arriveDate: '1577102268',
                viaId: '火星国际空间站',
                leaveDate: '1577102268',
                voyageId: '45',
                portName: 1,
                portTypeName:'起始港口',
              },
              {
                arriveDate: '1577102268',
                viaId: '木星空间站',
                leaveDate: '1577102268',
                voyageId: '66',
                portName: 1,
                portTypeName:'第一目的港口',
              },
              {
                arriveDate: '1577102268',
                viaId: '金星空间站',
                leaveDate: '1577102268',
                voyageId: '89',
                portName: 1,
                portTypeName:'第二目的港口',
              },
            ],
          },
          orderPallet: {
            //货盘信息
            pallet: {
              //货物名称
              goodsLevel: 1,
              //货物类型
              goodsType: 1,
              //货物存放位置
              storageLocation: 1,
              //货物性质
              goodsProperty: 1,
              //货物重量
              goodsWeight: '994',
              //体积
              goodsVolume: '784',
              //货物件数
              goodsCount: 'xxx',
              //是否可叠加
              isSuperposition: 1,
              //起运港
              startPort: 1,
              //目的港
              destinationPort: 1,
              //卸货率
              unpackingRate: '0.7',
              //少装货率
              lessPackingRate: '47.6',
              //受载日期
              loadDate: '1577102268',
              //截止日期
              endDate: '1577102268',
              phoneCode:'+86',
              //联系方式
              contactPhone: '15326586541',
              //联系人
              contacter: '张三',
              majorParts:'是',//是否重大件
              state:0,
            },
          },
        },
      });
    } else if (req.param('type') == '2') {
      res.send({
        code: '0000',
        message: '执行成功!',
        status: 200,
        data: {
            depositAttachment: {
                guid: 70,
                mainId: 13,
                fileName: "dingjin",
                fileType: "string",
                fileLog: '14',
                createDate: "2019-12-16T06:01:46.000+0000",
                creater: 0,
                updateDate: "2019-12-16T01:09:21.000+0000",
                updater: 0,
                deleteFlag: 0
            },
            balanceAttachment: {
                guid: 65,
                mainId: 13,
                fileName: "weikuan",
                fileType: "adf",
                fileLog: '15',
                createDate: "2019-12-16T06:02:01.000+0000",
                creater: 6,
                updateDate: "2019-12-12T05:29:40.000+0000",
                updater: 6,
                deleteFlag: 0
            },
            attachments: [
              {
                fileName:'test.png',
                type:'1',
                fileLog:'9'
              },          {
                fileName:'test.png',
                type:'2',
                fileLog:'12'
              },          {
                fileName:'test.png',
                type:'3',
                fileLog:'12'
              },          {
                fileName:'test.png',
                type:'4',
                fileLog:'14'
              },          {
                fileName:'test.png',
                type:'5',
                fileLog:'15'
              },          {
                fileName:'test.png',
                type:'6',
                fileLog:'21'
              }
            ],
            order: {
                guid: 13,
                orderNumber: "DYWLHY201912101556425D",
                orderType: 0,
                voyageId: 12,
                palletId: 2,
                orderStatus: 0,
                payStatus: 0,
                deliverStatus: 0,
                takeStatus:1,
                contractMoney: 105033333333.0000000000,
                downpayment: 2353533.0000000000,
                createDate: "2019-12-10T07:56:42.000+0000",
                creater: 3,
                updateDate: "2019-12-10T10:13:47.000+0000",
                updater: 4,
                deleteFlag: 0,
                ladingBill: 0,
                contacter:'张三',
                phoneCode:'86',
                contactPhone:'19912341234',
            }
        },  
      });
    }
  },

  'GET /business/order/history/:id': (req: Request, res: Response) => {
    if (req.param('type') == '1') {
      res.send({
        data: {
          attachments: [
              {
                  file_url: null,
                  file_content: null,
                  file_name: "xieyi12",
                  file_origin_name: null,
                  file_url_thum: null,
                  main_id: 13,
                  file_log: 11,
                  update_date: "2019-12-10T09:15:14.000+0000",
                  file_size: null,
                  updater: 3,
                  file_type: "xieyi12",
                  creater: 3,
                  guid: 55,
                  delete_flag: 0,
                  create_date: "2019-12-10T09:15:14.000+0000"
              },
              {
                  file_url: null,
                  file_content: null,
                  file_name: "danzheng14",
                  file_origin_name: null,
                  file_url_thum: null,
                  main_id: 13,
                  file_log: 12,
                  update_date: "2019-12-10T09:15:14.000+0000",
                  file_size: null,
                  updater: 3,
                  file_type: "danzheng14",
                  creater: 3,
                  guid: 56,
                  delete_flag: 0,
                  create_date: "2019-12-10T09:15:14.000+0000"
              },
              {
                  file_url: null,
                  file_content: null,
                  file_name: "danzheng13",
                  file_origin_name: null,
                  file_url_thum: null,
                  main_id: 13,
                  file_log: 12,
                  update_date: "2019-12-10T09:15:14.000+0000",
                  file_size: null,
                  updater: 3,
                  file_type: "danzheng13",
                  creater: 3,
                  guid: 57,
                  delete_flag: 0,
                  create_date: "2019-12-10T09:15:14.000+0000"
              }
          ],
          depositAttachment: {
                guid: 70,
                mainId: 13,
                fileName: "dingjin",
                fileType: "string",
                fileLog: 14,
                createDate: "2019-12-16T06:01:46.000+0000",
                creater: 0,
                updateDate: "2019-12-16T01:09:21.000+0000",
                updater: 0,
                deleteFlag: 0
            },
          order: {
              orderNumber: "DYWLHY201912101556425D",
              contractMoney: 105033333333.0000000000,
              downpayment: 2353533.0000000000,
          }
        },
      code: "0000",
      message: "执行成功!",
      status: 200
      })
    } else if (req.param('type') == '2') {
      res.send({
        data: {
          depositAttachment: {
            guid: 70,
            mainId: 13,
            fileName: "dingjin",
            fileType: "string",
            fileLog: 14,
            createDate: "2019-12-16T06:01:46.000+0000",
            creater: 0,
            updateDate: "2019-12-16T01:09:21.000+0000",
            updater: 0,
            deleteFlag: 0
          },
          order: {
            orderNumber: "DYWLHY201912101556425D",
            contractMoney: 105033333333.0000000000,
            downpayment: 2353533.0000000000,
            contacter: '林',
            phoneCode: '+86',
            contactPhone: '1234567890',
            orderStatus: 1,
            payStatus: 2,
            deliverStatus: 1,
            takeStatus: 1,
          }
        },
        code: "0000",
        message: "执行成功!",
        status: 200
      });
    } else if (req.param('type') == '3') {
      res.send({
        data: {
          logisticsInformation: "",
          order: {
            orderNumber: "DYWLHY201912101556425D",
            contractMoney: 105033333333.0000000000,
            downpayment: 2353533.0000000000,
            orderStatus: 1,
            payStatus: 2,
            deliverStatus: 1,
            takeStatus: 1,
          }
        },
        code: "0000",
        message: "执行成功!",
        status: 200
      });
    } else if (req.param('type') == '4') {
      res.send({
        data: {
              balanceAttachment: {
                  guid: 65,
                  mainId: 13,
                  fileName: "weikuan",
                  fileType: "adf",
                  fileLog: 15,
                  createDate: "2019-12-16T06:02:01.000+0000",
                  creater: 6,
                  updateDate: "2019-12-12T05:29:40.000+0000",
                  updater: 6,
                  deleteFlag: 0
              },
              order: {
                  orderNumber: "DYWLHY201912101556425D",
                  contractMoney: 105033333333.0000000000,
                  downpayment: 2353533.0000000000,
                  contacter: '林',
                  phoneCode: '+86',
                  contactPhone: '1234567890',
              }
          },
          code: "0000",
          message: "执行成功!",
          status: 200          
      });
    }else if(req.param('type') == '4'){
      res.send({
        data: {
            logisticsInformation: "",
            order: {
                orderNumber: "DYWLHY201912101556425D",
                contractMoney: 105033333333.0000000000,
                downpayment: 2353533.0000000000,
            }
          },
          code: "0000",
          message: "执行成功!",
          status: 200
      });        
    }else if(req.param('type') == '3'){
      res.send({
        data: {
            settlementAttachment: {
                  guid: 72,
                  mainId: 17,
                  fileName: "ddddd",
                  fileType: 'stridfffffng',
                  fileLog: 21,
                  createDate: "2019-12-16T09:29:58.000+0000",
                  creater: 4,
                  updateDate: "2019-12-16T09:29:58.000+0000",
                  updater: 4,
                  deleteFlag: 0
              },
            order: {
                orderNumber: "DYWLHY201912101556425D",
                contractMoney: 105033333333.0000000000,
                downpayment: 2353533.0000000000,
            }
          },
          code: "0000",
          message: "执行成功!",
          status: 200
      });        
    }
  },

  //根据ID查询货盘
  'GET /business/logistics': (req: Request, res: Response) => {
    res.send({
      code: '0000',
      message: '执行成功!',
      status: 200,
      data: {
        logisticsInfo:[
          {
            portName:'订单审核通过准备开始运输',
            arrivePortTime:'2019/10/10 14:24:06',
          },
          {
            portName:'货物正在装填到XXXXX船上',
            arrivePortTime:'2019/10/10 14:34:06',
          },
          {
            portName:'XXXXX在XXXXX上',
            arrivePortTime:'2019/10/10 14:44:06',
          },
          {
            portName:'XXXXX船到达XXXXX中转站',
            arrivePortTime:'2019/10/11 04:44:06',
          },
          {
            portName:'XXXXX船到达XXXXX地方',
            arrivePortTime:'2019/10/11 14:44:06',
          },
          {
            portName:'XXXXX船到达XXXXX目的地',
            arrivePortTime:'2019/10/12 01:44:06',
          },
          {
            portName:'XXXXX货物已经卸载完成',
            arrivePortTime:'2019/10/12 08:44:06',
          }
        ]
      },  
    });
  }
};
