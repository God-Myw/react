import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    'GET /sys/chat/list': (req: Request, res: Response) => {
        const { token } = req.headers;
        if (token === 'huozhu111') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "xianshangkefu",
                            unReadCounts: 0,
                            guid: 6,
                            latestMessage: "cfsdcsdcn,nev",
                            userType: 1,
                            userId: 6,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        } else if (token === 'chuandong111') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "xianshangkefu",
                            unReadCounts: 0,
                            guid: 6,
                            latestMessage: "cfsdcsdcn,nev",
                            userType: 1,
                            userId: 6,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        } else if (token === 'xianshangkefu111') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "huozhu",
                            unReadCounts: 0,
                            guid: 1,
                            latestMessage: "",
                            userType: 4,
                            userId: 1,
                            latestMessageType: ""
                        }, {
                            accountId: "chuandong",
                            unReadCounts: 0,
                            guid: 2,
                            latestMessage: "",
                            userType: 5,
                            userId: 2,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        } else if (token === 'huozhu222') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "xianshangkefu",
                            unReadCounts: 0,
                            guid: 16,
                            latestMessage: "cfsdcsdcn,nev",
                            userType: 1,
                            userId: 16,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        } else if (token === 'chuandong222') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "xianshangkefu",
                            unReadCounts: 0,
                            guid: 16,
                            latestMessage: "cfsdcsdcn,nev",
                            userType: 1,
                            userId: 16,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        } else if (token === 'xianshangkefu222') {
            res.send({
                data: {
                    isSysMsg: false,
                    msgList: [
                        {
                            accountId: "huozhu1",
                            unReadCounts: 0,
                            guid: 11,
                            latestMessage: "",
                            userType: 4,
                            userId: 11,
                            latestMessageType: ""
                        }, {
                            accountId: "chuandong1",
                            unReadCounts: 0,
                            guid: 22,
                            latestMessage: "",
                            userType: 5,
                            userId: 22,
                            latestMessageType: ""
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200
            })
        }
    },
    'POST /sys/chat': (req: Request, res: Response) => {
        res.send({
            data: null,
            code: "0000",
            message: "执行成功!",
            status: 200
        });
    },
    'GET /sys/chat/message/system': (req: Request, res: Response) => {
        res.send(
            {
                data: {
                    list: [
                        {
                            guid: 123,
                            title: "test",
                            content: "test",
                            sendTime: "1576904793781",
                            isRead: 1
                        },

                        {
                            guid: 123,
                            title: "证书到期通知",
                            content: '您好，我是货主001，您的《xxxxx证书》将于<span className="date">2020年10月23日</span>到期，请您及时处理！',
                            sendTime: "1576904793781",
                            isRead: 0
                        }
                    ]
                },
                code: "0000",
                message: "执行成功!",
                status: 200

            });
    }
}