import { parse } from 'querystring';
import { assign, forEach } from 'lodash';
import { getLocale } from 'umi-plugin-locale';
import JsonUtils from './JsonUtils';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (APP_TYPE === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 字典获取
 */
export interface dicts {
  name: string;
  guid: string;
  items: items[];
}
export interface items {
  code: string;
  textValue: string;
}

/**
 * 字典获取
 * @param name  字典key
 */
export const getDictDetail = (name: string): items[] => {

  const dicts = JsonUtils.stringToJson('(' + String(localStorage.getItem('dictData')) + ')');
  const en = dicts['en'];
  const zh = dicts['zh'];
  let result: items[] = [];
  if (getLocale() === 'en-US') {
    en.map((item: dicts) => {
      if (name === item.name) {
        assign(result, item.items);
        return;
      }
    });
  } else {
    zh.map((item: dicts) => {
      if (name === item.name) {
        assign(result, item.items);
        return;
      }
    });
  }
  return result;
};

/**
 * 获取表格区分的值
 * @param name  字典key
 * @param code  code值
 */
export const getTableEnumText = (name: string, code: any): string => {
  let textValue = '';
  forEach(getDictDetail(name), item => {
    if (item.code === code) {
      textValue = item.textValue;
    }
  });
  return textValue;
};

/**
 * 查看原图
 *
 * @var  {[type]}
 */
export const linkHref = (value: any) => {
  const img = new Image();
  img.src = value;
  var newWin = window.open("", "_blank");
  newWin.document.write(img.outerHTML);
  newWin.document.title = "查看原图"
  newWin.document.close();
}
