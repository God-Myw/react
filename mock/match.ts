import { Request, Response } from 'express';
//供需匹配
const getMatchList = (req: Request, res: Response) => {
  if (req.param('currentPage') == '1') {
    res.send({
      code: '0000',
      message: 'OK',
      status: 200,
      currentPage: 1,
      data: {
        total: 20,
        voyageNames: [
          {
            guid: 1,
            voyageName: '航线1',
            matchStopStatus: 0,
          },
          {
            guid: 2,
            voyageName: '航线2',
            matchStopStatus: 0,
          },
          {
            guid: 3,
            voyageName: '航线3',
            matchStopStatus: 0,
          },
          {
            guid: 4,
            voyageName: '航线4',
            matchStopStatus: 0,
          },
          {
            guid: 5,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 6,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 7,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 8,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 9,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 10,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 11,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 12,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 13,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 14,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
          {
            guid: 15,
            voyageName: '航线5',
            matchStopStatus: 0,
          },
        ],
      },
    });
  } else if (req.param('currentPage') == '2') {
    res.send({
      code: '0000',
      message: 'OK',
      status: 200,
      currentPage: 2,
      data: {
        total: 20,
        voyageNames: [
          {
            guid: 16,
            voyageName: '航线1',
            matchStopStatus: 0,
          },
          {
            guid: 17,
            voyageName: '航线2',
            matchStopStatus: 0,
          },
          {
            guid: 18,
            voyageName: '航线3',
            matchStopStatus: 0,
          },
          {
            guid: 19,
            voyageName: '航线4',
            matchStopStatus: 1,
          },
          {
            guid: 20,
            voyageName: '航线5',
            matchStopStatus: 1,
          },
        ],
      },
    });
  }
};

const getMatch = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {
      voyageMatch: {
        currentPage: 1,
        total: 5,
        shipName: '大和号',
        shipType: 1,
        buildParticularYear: 1990,
        tonNumber: 23333,
        shipCrane: 1,
        shipDeck: 1,
        draft: 2333,
        anchoredPort: 1,
        contacter: 'xiao',
        phoneCode: 231,
        contactPhone: 866888888,
        acceptCapacity: 20000,
        acceptTon: 5550,
        shipVoyage: 22323,
        voyageLineName: '美西线',
        port: '天津港',
        voyagePorts: [
          { portId: 1, arriveDate: '1577165908', leaveDate: '1577165908', portTypeName: '起始港口' },
          { portId: 2, arriveDate: '1577165908', leaveDate: '1577165908', portTypeName: '第一目的港口' },
          { portId: 3, arriveDate: '1577165908', leaveDate: '1577165908', portTypeName: '第二目的港口' },
        ],
        pallets: [
          { palletGuid: 1, goodsType: 1, goodsProperty: 2, goodsWeight: 200, contacter: 'xiao', phoneCode: '020', contactPhone: '24234234', startPort: 6, destinationPort: 8, matchStatus: 0 },
          { palletGuid: 2, goodsType: 1, goodsProperty: 2, goodsWeight: 200, contacter: 'xiao', phoneCode: '020', contactPhone: '24234234', startPort: 6, destinationPort: 8, matchStatus: 1 },
          { palletGuid: 3, goodsType: 1, goodsProperty: 2, goodsWeight: 200, contacter: 'xiao', phoneCode: '020', contactPhone: '24234234', startPort: 6, destinationPort: 8, matchStatus: 0 },
          { palletGuid: 4, goodsType: 1, goodsProperty: 2, goodsWeight: 200, contacter: 'xiao', phoneCode: '020', contactPhone: '24234234', startPort: 6, destinationPort: 8, matchStatus: 1 },
          { palletGuid: 5, goodsType: 1, goodsProperty: 2, goodsWeight: 200, contacter: 'xiao', phoneCode: '020', contactPhone: '24234234', startPort: 6, destinationPort: 8, matchStatus: 0 }
        ],
      },
    },
  });
};
const deleteMatch = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: '删除成功'
  });
}

const putMatch = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: '删除成功'
  });
}

const postOrder = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: '删除成功'
  });
}

const remark = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: '删除成功'
  });
}

const pallet = (req: Request, res: Response) => {
  res.send({
    code: '0',
    message: 'OK',
    status: 200,
    data: {
      pallet: {
        guid:1,
        goodsLevel: 1,
        location:1,
        goodsProperty:1,
        goodsType: 2,
        goodsWeight: 3,
        goodsVolume: 4,
        goodsCount: 5,
        isSuperposition: 6,
        startPort: 7,
        destinationPort: 7,
        loadDate: '1577176466',
        endDate: '1577176466',
        contacter: '张三',
        phoneCode:'+86',
        contactPhone: '18352341181',
        lessPackingRate: '25',
        unpackingRate: '40',
        majorParts:'是',
      },
      palletFileList:{
        palletFile:[{
          fileName:'fileName',
          type:'pallet',
        }]
      }
    },
  });
}

export default {
  'GET /business/pallets/:id':pallet,
  'GET /business/match': getMatchList,
  'GET /business/match/:uid': getMatch,
  'DELETE /business/match/:uid': deleteMatch,
  'PUT /business/match': putMatch,
  'PUT /business/match/remark': remark,
  'POST /business/order': postOrder
};
