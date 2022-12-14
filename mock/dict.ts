import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略 TODO Smple
  'GET /sys/dict/all': (req: Request, res: Response) => {
    const { type } = req.query;
    if (type === '1') {
      res.send({
        data: {
          en: [],
          zh: [
            {
              name: 'ship_type',
              guid: 1,
              items: [
                {
                  code: '0',
                  textValue: '杂货船',
                },
                {
                  code: '1',
                  textValue: '散装船',
                },
                {
                  code: '2',
                  textValue: '集装箱船',                  
                },
                {
                  code: '3',
                  textValue: '滚装船',
                },
                {
                  code: '4',
                  textValue: '甲板驳船',
                },
                {
                  code: '5',
                  textValue: '油船',
                },
                {
                  code: '6',
                  textValue: '液化气体船',                  
                },
                {
                  code: '7',
                  textValue: '多用途船',
                },
              ],
            },
            {
              name: 'trade_type',
              guid: 2,
              items: [
                {
                  code: '1',
                  textValue: '买家',
                },
                {
                  code: '2',
                  textValue: '卖家',

                },
              ],
            },
            {

              name: 'ship_age',
              guid: 3,
              items: [
                {
                  code: '1',
                  textValue: '1年',
                },
                {
                  code: '2',
                  textValue: '2年',
                },
                {
                  code: '1',
                  textValue: '1年',
                },
                {
                  code: '3',
                  textValue: '3年',
                },
                {
                  code: '4',
                  textValue: '4年',
                },
                {
                  code: '5',
                  textValue: '5年',
                },
              ],
            },
            {
              name: 'ship_age',
              guid: 1,
              items: [
                {
                  code: '0',
                  textValue: '0',
                },
                {
                  code: '1',
                  textValue: '1',
                },
                {
                  code: '2',
                  textValue: '2',
                },
                {
                  code: '3',
                  textValue: '3',
                },
                {
                  code: '4',
                  textValue: '4',
                },
              ],
            },
            {
              name: 'voyage_area',
              guid: 4,
              items: [
                {
                  code: '1',
                  textValue: '航区1',
                },
                {
                  code: '2',
                  textValue: '航区2',
                },
                {
                  code: '3',
                  textValue: '航区3',
                },
                {
                  code: '4',
                  textValue: '航区4',
                },
                {
                  code: '5',
                  textValue: '航区5',
                },
                {
                  code: '6',
                  textValue: '航区6',
                },
              ],
            },
            {
              name: 'classification_society',
              guid: 5,
              items: [
                {
                  code: '0',
                  textValue: '中国船级社',
                },
                {
                  code: '1',
                  textValue: '美国船级社',
                },
                {
                  code: '2',
                  textValue: '法国船级社',
                },
                {
                  code: '3',
                  textValue: '挪威船级社',
                },
                {
                  code: '4',
                  textValue: '劳氏船级社',
                },
                {
                  code: '5',
                  textValue: '韩国船级社',
                },
                {
                  code: '6',
                  textValue: '日本船级社',
                },
                {
                  code: '7',
                  textValue: '俄罗斯船级社',
                },
                {
                  code: '8',
                  textValue: '意大利船级社',
                },
                {
                  code: '9',
                  textValue: '越南船级社',
                },
                {
                  code: '10',
                  textValue: '中国船检',
                },
                
              ],
            },
            {

              name: 'check_status',
              guid: 6,
              items: [
                {
                  code: '0',
                  textValue: '未发布',
                },
                {
                  code: '1',
                  textValue: '已发布',
                },
              ],
            }
            , {//船舶类型
              name: "ship_type",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "类型一"
                },
                {
                  code: 2,
                  textValue: "类型二"
                }
              ]
            }, {//船型
              name: "ship_deck",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "甲板一"
                },
                {
                  code: 2,
                  textValue: "甲板二"
                }
              ]
            }, {//航区
              name: "voyage_area",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "上海航区"
                },
                {
                  code: 2,
                  textValue: "苏州航区"
                }
              ]
            }, {//船级社
              name: "classification_society",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "一级社"
                },
                {
                  code: 2,
                  textValue: "二级社"
                }
              ]
            }, {//港口
              name: "port",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "上海港"
                },
                {
                  code: 2,
                  textValue: "苏州港"
                }
              ]
            }, {//发布状态
              name: "state",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "保存"
                },
                {
                  code: 2,
                  textValue: "提交"
                }
              ]
            }, {//有效期限
              name: "validity_period",
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: "一年"
                },
                {
                  code: 2,
                  textValue: "三年"
                },
                {
                  code: 3,
                  textValue: "五年"
                }
              ]
            },
            {
              name: 'ship_age',
              guid: 1,
              items: [
                {
                  code: '0',
                  textValue: '新船',
                },
                {
                  code: '1',
                  textValue: '1年',
                },
                {
                  code: '2',
                  textValue: '2年',
                },
                {
                  code: '3',
                  textValue: '3年',
                },
                {
                  code: '4',
                  textValue: '4年',
                },
              ],
            },
            {
              name: 'user_type',
              guid: 1,
              items: [
                {
                  code: 1,
                  textValue: '船东',
                },
                {
                  code: 2,
                  textValue: '货主',
                },
                {
                  code: 2,
                  textValue: '客服',
                },
              ],
            },
          ],
        },
        code: '0000',
        message: '执行成功!',
        status: '200',
      });
    }
  },
};
