import { Request, Response } from 'express';

const getDictTypeList = (req: Request, res: Response) => {
  let type=parseInt(req.param('type')); 
  if (type==1) {
    if (req.param('currentPage') == '3') {
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 3,
          total: 15,
          dictTypes: [
            {
              guid: 1,
              name: 'x类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 2,
              name: 'x类型',
              createUser: 'bbb',
              createDate: '2019-12-2',
            },
            {
              guid: 3,
              name: 'x类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            // {
            //   guid: 4,
            //   name: 'x类型',
            //   createUser: 'xiao',
            //   createDate: '2019-12-2',
            // },
            // {
            //   guid: 5,
            //   name: 'b类型',
            //   createUser: 'xiao',
            //   createDate: '2019-12-2',
            // },
          ],
        },
      });
    }else
    if (req.param('currentPage') == '1') {
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 1,
          total: 15,
          dictTypes: [
            {
              guid: 1,
              name: 'a类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 2,
              name: 'b类型',
              createUser: 'bbb',
              createDate: '2019-12-2',
            },
            {
              guid: 3,
              name: 'b类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 4,
              name: 'b类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 5,
              name: 'b类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
          ],
        },
      });
    }else

    if (req.param('currentPage') == '2') {
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 2,
          total: 15,
          dictTypes: [
            {
              guid: 1,
              name: 'f类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 2,
              name: 'f类型',
              createUser: 'bbbbbbbb',
              createDate: '2019-12-2',
            },
            {
              guid: 3,
              name: 'f类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 4,
              name: 'e类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 5,
              name: 'g类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
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
          total: 15,
          dictTypes: [
            {
              guid: 1,
              name: 'f类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 2,
              name: 'f类型',
              createUser: 'bbbbbbbb',
              createDate: '2019-12-2',
            },
            {
              guid: 3,
              name: 'f类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 4,
              name: 'e类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
            {
              guid: 5,
              name: 'g类型',
              createUser: 'xiao',
              createDate: '2019-12-2',
            },
          ],
        },
      });
    }
  }
};

const getDictType = (req: Request, res: Response) => {
  let type=parseInt(req.param('type')); 
  if (type==1) {
    res.send({
      code: '0000',
      message: '执行成功',
      status: 200,
      data: {
        dictType: {
          guid: 1,
          name: 'a类型',
          createUser: 'xiao',
          createDate: '2019-12-2',
          updateUser: 'xiao',
          updateDate: '2019-12-3',
        },
      },
    });
  }
};

const addDictType = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '执行成功',
    status: 200,
    data: null,
  });
};
const deleteDictType = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '删除成功',
    status: 200,
    data: null,
  });
};

const putDictType = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: null,
  });
};``

const getDictList = (req: Request, res: Response) => {``
    if (req.param('currentPage') == '1') {
      res.send({
        code: '0000',
        message: '执行成功',
        status: 200,
        data: {
          currentPage: 1,
          total: 5,
          dictList: [
            {
              guid: 1,
              name: 'a类型',
              titleCn: '阿尔萨斯',
              titleEn: 'Arthas',
              remark: '洛丹伦王子',
            },
            {
              guid: 2,
              name: 'b类型',
              titleCn: '克尔苏加德',
              titleEn: 'Arthas',
              remark: '洛丹伦王子',
            },
            {
              guid: 3,
              name: 'c类型',
              titleCn: '米娜希尔',
              titleEn: 'Arthas',
              remark: '洛丹伦王子',
            },
            {
              guid: 4,
              name: 'd类型',
              titleCn: '阿尔萨斯',
              titleEn: 'Arthas',
              remark: '洛丹伦王子',
            },
            {
              guid: 5,
              name: 'e类型',
              titleCn: '阿尔萨斯',
              titleEn: 'Arthas',
              remark: '洛丹伦王子',
            },
          ],
        },
      });
    }
};

const addDict = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '执行成功',
    status: 200,
    data: null,
  });
};

const putDict = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: 'OK',
    status: 200,
    data: null,
  });
};

const deleteDict = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '删除成功',
    status: 200,
    data: null,
  });
};
const getDict = (req: Request, res: Response) => {
  res.send({
    code: '0000',
    message: '执行成功',
    status: 200,
    data: {
      dict: {
        guid: '1',
        name: 'a类型',
        titleCn: '阿尔萨斯',
        titleEn: 'Arthas',
        remark: '洛丹伦王子',
      },
    },
  });
};
export default {
  'GET /sys/dictType': getDictTypeList,
  'GET /sys/dictType/:id': getDictType,
  'POST /sys/dictType': addDictType,
  'DELETE /sys/dictType/:id': deleteDictType,
  'PUT /sys/dictType': putDictType,
  'GET /sys/dict': getDictList,
  'POST /sys/dict': addDict,
  'PUT /sys/dict': putDict,
  'DELETE /sys/dict/:id': deleteDict,
  'GET /sys/dict/:id': getDict,
};
