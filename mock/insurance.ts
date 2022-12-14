import { Request, Response } from 'express';

//获取投保列表
const getInsuranceList = (req: Request, res: Response) => {
  //货主
  if (req.param('type') == '2') {
    res.send({
      data: {
        total: 1,
        insurances: [
          {
            transportStart: '1575512993000',
            contactNumber: '19942994831',
            guid: 7,
            goods: '火箭1111',
            state: 0,
            insuranceCompany: 1,
            policyHolder: 'dhc',
          },
        ],
        currentPage: 1,
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  } else if (req.param('type') == '1') {
    //船东
    res.send({
      data: {
        total: 1,
        insurances: [
          {
            transportStart: '1575512993000',
            contactNumber: '19948884371',
            guid: 6,
            state: 0,
            shipName: '大辽宁号',
            insuranceCompany: 1,
            policyHolder: '华信1',
          },
        ],
        currentPage: 1,
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  } else {
    res.send({
      data: {
        total: 1,
        insurances: [
          {
            accountId: 'chuandong',
            shipAge: 1,
            transportStart: '1576151897000',
            contactNumber: '19948884371',
            guid: 6,
            userType: 5,
            insuranceCompany: 1,
            policyHolder: '华信z1',
            status: 0,
          },
        ],
        currentPage: 1,
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  }
};

//新增投保shiper
const addInsuranceShiper = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {},
  });
};

//新增投保owner
const addInsuranceOwner = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {},
  });
};

//修改投保owner
const editInsuranceOwner = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {},
  });
};

//修改投保shiper
const editInsuranceShiper = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {},
  });
};

//删除投保
const deleteInsurance = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: {},
  });
};

//获取投保详情
const getInsuranceView = (req: Request, res: Response) => {
  if (req.param('type') == '1') {
    res.send({
      data: {
        insurance: {
          guid: 11,
          policyHolder: '华信',
          phoneCode: '+86',
          contactNumber: '19948884371',
          policyholderIdType: 1,
          policyholderIdNumber: '33042911999930333',
          insuranceCompany: 1,
          transportStart: '1575512993000',
          transportContacter: '超3',
          transportContacterNumber: '18378889990',
          state: 0,
          status: 0,
          shipId: 1,
          packageUnitName: 0,
          shipAge: 1,
          createDate: '2019-12-13T06:12:02.000+0000',
          creater: 6,
          updateDate: '2019-12-13T06:12:02.000+0000',
          updater: 6,
          deleteFlag: 0,
        },
        shipName: '123',
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  } else if (req.param('type') == '2') {
    res.send({
      data: {
        insurance: {
          guid: 7,
          policyHolder: 'dhc',
          phoneCode: '+88',
          contactNumber: '19942994831',
          insuranceCompany: 2,
          transportStart: '2019-12-05T03:42:41.000+0000',
          state: 0,
          status: 0,
          insuranceMoney: 999999999.0,
          insuranceCategory: 2,
          goods: '火箭1111',
          goodsType: 2,
          packageUnitName: 2,
          goodsCountPackage: '1baozhuang3',
          invoiceContractNumber: 'DYWL982739847',
          billOfLadingWaybillNumber: '199922939',
          organizationCode: 'dywl2234',
          insuredName: 'jiuquana',
          insuredPhoneCode: '+86',
          insuredContactNumber: '183672228988',
          insuredOrganizationCode: 'jq029u394',
          voyageName: 'tianjin',
          transportType: 1,
          goodsValue: 100000000334.0,
          insuranceRate: 1.1,
          premiumCalculation: 98237234.0,
          departure: 1,
          destination: 3,
          shipAge: 1,
          createDate: '2019-12-05T03:08:35.000+0000',
          creater: 5,
          updateDate: '2019-12-05T03:38:40.000+0000',
          updater: 5,
          deleteFlag: 0,
        },
      },
      code: '0000',
      message: '执行成功!',
      status: 200,
    });
  }
};

export default {
  'GET /business/insurance': getInsuranceList,
  'POST /business/insurance/shipowner': addInsuranceOwner,
  'PUT /business/insurance/shipowner': editInsuranceOwner,
  'POST /business/insurance/consignor': addInsuranceShiper,
  'PUT /business/insurance/consignor': editInsuranceShiper,
  'DELETE /business/insurance/:id': deleteInsurance,
  'GET /business/insurance/:id': getInsuranceView,
};
