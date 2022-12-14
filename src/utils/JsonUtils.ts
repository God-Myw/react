import React from 'react'

class JsonUtils extends React.Component {

    /**
    *字符串转json
    *
    */
    static stringToJson(data: string) {
        return eval('(' + data + ')'); // IE不支持JSON.parse
    }
    /**
    *json转字符串
    */
    static jsonToString(data: any) {
        return JSON.stringify(data);
    }
    /**
    *map转换为json
    */
    static mapToJson(map: any) {
        return JSON.stringify(JsonUtils.strMapToObj(map));
    }
    /**
    *json转换为map
    */
    static jsonToMap(jsonStr: string) {
        return JsonUtils.objToStrMap(JSON.parse(jsonStr));
    }

    /**
    *map转化为对象（map所有键都是字符串，可以将其转换为对象）
    */
    static strMapToObj(strMap: any) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }

    /**
    *对象转换为Map
    */
    static objToStrMap(obj: any) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
}

export default JsonUtils;