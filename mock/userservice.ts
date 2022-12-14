import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    'GET /sys/users/service': (req: Request, res: Response) => {
        res.send({
            code: '0',
            message: 'OK',
            status: 200,
            data: {
                users: [
                    {
                        "accountId": "xianshangkefu",
                        "guid": 13321
                    },
                    {
                        "accountId": "客服一",
                        "guid": 1
                    },
                    {
                        "accountId": "客服二",
                        "guid": 2
                    },
                    {
                        "accountId": "客服三",
                        "guid": 3
                    },
                    {
                        "accountId": "客服四",
                        "guid": 4
                    },
                    {
                        "accountId": "客服五",
                        "guid": 5
                    },
                    {
                        "accountId": "客服六",
                        "guid": 6
                    },
                    {
                        "accountId": "客服七",
                        "guid": 7
                    },
                    {
                        "accountId": "客服八",
                        "guid": 8
                    },
                    {
                        "accountId": "客服九",
                        "guid": 9
                    },
                ]
            }
        });
    },

    'POST /business/grant': (req: Request, res: Response) => {
        res.send({
            code: '0',
            message: 'OK',
            status: 200,
            data: '4152'
        });
    },

    'DELETE /business/grant': (req: Request, res: Response) => {
        res.send({
            code: '0',
            message: 'OK',
            status: 200,
            data: '4152'
        });
    },
}