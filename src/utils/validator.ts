import { formatMessage } from "umi-plugin-react/locale";
import { isNil } from "lodash";
import { message } from 'antd';

//校验手机号码
export const checkPhone = (name: string, rule: any, value: any, callback: any) => {
  if ((value !== '' && value.length === 11 && !/^1(3|4|5|7|8)\d{9}$/.test(value)) || (value !== '' && value.length !== 11)) {
    callback(formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct', }));
  } else {
    callback();
  }
};

//校验数字
export const checkNumber = (rule: any, value: any, callback: any) => {
  if (value !== '' &&  !/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)) {
    callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
  } else {
    callback();
  }
};

//校验装卸货量
export const checkRate = (rule: any, value: any, callback: any) => {
  if(value<-100 || value>100){
    callback(formatMessage({ id: 'user-login.login.pls-input-rate', }));
  }else {
    callback();
  }
};

//校验邮箱
export const checkEmail = (name: string, rule: any, value: any, callback: any) => {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (value !== '' && !re.test(value)) {
    callback(formatMessage({ id: 'index-accountManager-email.correct', }));
  } else {
    callback();
  }
};

export const checkMatch = (name: string, rule: any, value: any, callback: any) => {
  const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,16}$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(name + '格式错误');
  }
};

//最大长度check
export const checkLength = (
  name: string,
  min: number,
  max: number,
  rule: any,
  value: any,
  callback: any,
) => {
  if (value !== '') {
    if (value.length > max) {
      callback(name + '输入的字符大于' + max.toString() + '位,请重新输入！');
    } else if (value.length < min) {
      callback(name + '输入的字符小于' + min.toString() + '位,请重新输入！');
    }
  } else {
    callback();
  }
};

//校验其他说明
export const checkRemark = (
  name: string,
  min: number,
  max: number,
  rule: any,
  value: any,
  callback: any
) => {
  if (value.length > max) {
    callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.inputCorrectOtherDescription', }));
  } else {
    callback();
  }
};

//校验身份证号
// export const checkIdNo = (value:any) => {
//   const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
//   const q = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;
//   if (value && value.length===18 && p.test(value)) {
//     const factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
//     const parity = [ '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' ];
//     const code = value.substring(17);
//     let sum = 0;
//     for(let i=0; i < 17; i+=1) {
//       sum += value[i] * factor[i];
//     }
//     if(parity[sum % 11] === code.toUpperCase()) {
//       return true;
//     }
//   }
//   if (value && value.length===15 && q.test(value)) {
//     return true;
//   }
//   return false;
// };

export const checkIDcard1 = (rule: any, value: any, callback: any) => {
  if (checkIDCard(value)) {
    callback();
  } else {
    callback('请输入正确的身份证号码');
  }
};

// 密码验证
export const CheckPassWord = (name: string, password: any, callback: any) => {
  var str = password;
  var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/);
  if (!isNil(str) && str !== '' && str.length < 8) {
    callback(formatMessage({ id: 'user-login.login.pls-input-length-check', }));
  } else if (!reg.test(str)) {
    callback(formatMessage({ id: 'user-login.login.pls-input-input-check', }));
  } else {
    callback();
  }
};

export const HandleBeforeUpload = (file: any) => {
  //限制图片 格式、size、分辨率
  const isJPG = file.type === 'image/jpg';
  const isJPEG = file.type === 'image/jpeg';
  const isGIF = file.type === 'image/gif';
  const isPNG = file.type === 'image/png';
  const isBMP = file.type === 'image/bmp';
  const isIMG = file.type === 'image/img';
  const isTIFF = file.type === 'image/tiff';
  const a:PromiseLike<any> =  new Promise((resolve:any, reject:any) => {
    if(!(isJPG || isJPEG || isGIF || isPNG || isBMP || isIMG || isTIFF)) {
      reject(file);
      message.error(formatMessage({ id: 'user-login.login.account-image-type-check', }));
    } else {
      // 3M 3*1024*1024 
      if(file.size>10*1024*1024)
      {
        reject(file);
        message.error(formatMessage({ id: 'user-login.login.account-image-size-check', }));
      }else{
      resolve(file);
    }
    }
  });
  return a;
}

const checkIDCard = (value: any) => {
  // 加权因子
  const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  const code = value + '';
  const last = value[17];

  const seventeen = code.substring(0, 17);

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  const arr = seventeen.split('');
  const len = arr.length;
  let num = 0;
  for (let i = 0; i < len; i += 1) {
    num += <any>arr[i] * weight_factor[i];
  }

  // 获取余数
  const resisue = num % 11;
  const last_no = check_code[resisue];

  // 格式的正则
  // 正则思路
  /*
  第一位不可能是0
  第二位到第六位可以是0-9
  第七位到第十位是年份，所以七八位为19或者20
  十一位和十二位是月份，这两位是01-12之间的数值
  十三位和十四位是日期，是从01-31之间的数值
  十五，十六，十七都是数字0-9
  十八位可能是数字0-9，也可能是X
  */
  const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

  // 判断格式是否正确
  const format = idcard_patter.test(value);

  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === last_no && format;
};
