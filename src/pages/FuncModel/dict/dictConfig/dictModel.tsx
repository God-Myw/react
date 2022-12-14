export interface dictModel {
  dictIndex?: string; //排序字段
  titleCn?: string;  //字典中文值
  titleEn?: string; //字典英文值
  remark?: string; //备注
  name?: string;  //字典类型名
  guid?: any; //guid
  parentId?:any;//字典类型code
}
