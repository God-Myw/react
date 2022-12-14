import { Request, Response } from 'express';

const getportList = (req: Request, res: Response) => {
  let type = parseInt(req.param('type'));
  if (type == 1) {
    if(req.param('countryName')=='中国'){
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 1,
          total: 5,
          ports: [
            {
              guid: 1,
              countryId: 1,
              portId: 1,
              countryName: '日本',
              portName: '中国港口1',
            },
            {
              guid: 2,
              countryId: 2,
              portId: 2,
              countryName: '中国',
              portName: '中国港口1',
            },
            {
              guid: 3,
              countryId: 3,
              portId: 3,
              countryName: '南非',
              portName: '中国港口1',
            },
            {
              guid: 4,
              countryId: 4,
              portId: 4,
              countryName: '美国',
              portName: '中国港口1',
            },
            {
              guid: 5,
              countryId: 5,
              portId: 5,
              countryName: '墨西哥',
              portName: '中国港口1',
            },
          ],
        },
      });
    }else if(req.param('countryName')=='日本'){
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 1,
          total: 5,
          ports: [
            {
              guid: 1,
              countryId: 1,
              portId: 1,
              countryName: '日本',
              portName: '日本港口1',
            },
            {
              guid: 2,
              countryId: 2,
              portId: 2,
              countryName: '中国',
              portName: '日本港口1',
            },
            {
              guid: 3,
              countryId: 3,
              portId: 3,
              countryName: '南非',
              portName: '日本港口1',
            },
            {
              guid: 4,
              countryId: 4,
              portId: 4,
              countryName: '美国',
              portName: '日本港口1',
            },
            {
              guid: 5,
              countryId: 5,
              portId: 5,
              countryName: '墨西哥',
              portName: '日本港口1',
            },
          ],
        },
      });
    }else{
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 1,
          total: 5,
          ports: [
            {
              guid: 1,
              countryId: 1,
              portId: 1,
              countryName: '日本',
              portName: '东京港',
            },
            {
              guid: 2,
              countryId: 2,
              portId: 2,
              countryName: '中国',
              portName: '洋山港',
            },
            {
              guid: 3,
              countryId: 3,
              portId: 3,
              countryName: '南非',
              portName: '好望角',
            },
            {
              guid: 4,
              countryId: 4,
              portId: 4,
              countryName: '美国',
              portName: '纽约港',
            },
            {
              guid: 5,
              countryId: 5,
              portId: 5,
              countryName: '墨西哥',
              portName: '瓜达拉哈拉',
            },
          ],
        },
      });
    }
    
  }
};

const addport = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '执行成功',
    status: 200,
    data: null,
  });
};

const deleteport = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '删除成功',
    status: 200,
    data: null,
  });
};

const putport = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: null,
  });
};

const getvoyageLineList = (req: Request, res: Response) => {
  let type = parseInt(req.param('type'));
  if (type == 1) {
    res.send({
      code: '0000',
      message: '执行成功',
      status: 200,
      data: {
        voyageLines: [
          {
            guid: 1,
            voyageLineNumber: '1',
            voyageLineName: '航线1',
            items: [
              {
                portTypeName: '起始港',
                countryName: '中国',
                countryId: 1,
                portName: '舟山港',
                portId: 1,
              },
              {
                portTypeName: '第一目的港',
                countryName: '中国',
                countryId: 1,
                portName: '天津港',
                portId: 2,
              },
              {
                portTypeName: '第二目的港',
                countryName: '日本',
                countryId: 2,
                portName: '大阪港',
                portId: 3,
              },
            ],
          },
          {
            guid: 2,
            voyageLineNumber: '2',
            voyageLineName: '航线2',
            items: [
              {
                portTypeName: '起始港',
                countryName: '中国',
                countryId: 1,
                portName: '维多利亚港',
                portId: 1,
              },
              {
                portTypeName: '第一目的港',
                countryName: '中国',
                countryId: 1,
                portName: '广州港',
                portId: 2,
              },
              {
                portTypeName: '第二目的港',
                countryName: '日本',
                countryId: 2,
                portName: '大阪港',
                portId: 3,
              },
            ],
          },
        ],
      },
    });
  }
};

const putvoyageLine = (req: Request, res: Response) => {
  let type = parseInt(req.param('type'));
  if (type == 1) {
    res.send({
      code: '0000',
      message: '执行成功',
      status: 200,
      data: null,
    });
  }
};

const postvoyageLine = (req: Request, res: Response) => {
  let type = parseInt(req.param('type'));
  if (type == 1) {
    res.send({
      code: '0000',
      message: '执行成功',
      status: 200,
      data: null,
    });
  }
};
export default {
  'GET /sys/port': getportList,
  'POST /sys/port': addport,
  'DELETE /sys/port/:id': deleteport,
  'PUT /sys/port': putport,
  'GET /business/voyageLine': getvoyageLineList,
  'PUT /business/voyageLine': putvoyageLine,
  'POST /business/voyageLine': postvoyageLine,
};
