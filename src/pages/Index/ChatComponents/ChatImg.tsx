import { message, Upload } from 'antd';
import React from 'react';
import { Content, ReceiveMsg } from './ChatModels';
import moment from 'moment';
import { checkSetLocalStorage } from './ChatObject';
import { formatMessage } from 'umi-plugin-react/locale';
import { postRequest } from '@/utils/request';
import JsonUtils from '@/utils/JsonUtils';
import lrz from 'lrz';

class ChatImg extends React.Component<{
    changeChatTarget: any;
    onlineId: number; JIM: any; target_name: string
}, {}> {
    constructor(props: Readonly<{ changeChatTarget: any; onlineId: number; JIM: any; target_name: string; }>) {
        super(props);
    }
    state = {
        comdfileData: '', // 大图片压缩之后的图片
        fileData: '', // base64
        file: '',
        create_time: 0
    }

    setMyimgMsg = (data: any) => {
        const from_username = localStorage.getItem("userId") + "_JIM";
        let mycontent: Content = {
            ctime_ms: data.ctime_ms,
            create_time: data.ctime_ms,
            from_id: from_username,
            from_name: from_username,
            target_id: this.props.target_name,
            img: this.state.comdfileData,
            msg_body: {
                text: ''
            },
            msg_type: 'mytemp' // 临时数据 用完需要清理
        };

        let msgItem: ReceiveMsg = {
            from_username: from_username,
            content: mycontent
        };
        checkSetLocalStorage(msgItem);
        this.props.changeChatTarget(Number(this.props.target_name.split('_')[0]), this.props.onlineId, '');
    }

    // 发送聊天图片信息至API
    setContentToApi = () => {
        const reqData = {
            onlineId: this.props.onlineId,
            userId: localStorage.getItem("userId"),
            content: '',
            url: this.state.fileData,
            type: 1, //1文本 2图片
            sendTime: this.state.create_time,
            msgType: 2
        }
        postRequest('/sys/chat', JsonUtils.jsonToString(reqData), (response: any) => {
            if (response.status !== 200) {
                message.error(formatMessage({ id: 'UserMenuComponent-ChatMsg.MessageCenterFailed' }));
            }
        });
    }

    // 上传前图片大小check
    beforeUpload = (file: any) => {
        const isLt2M = file.size / 1024 / 1024 < 3;
        if (!isLt2M) {
            message.error("选择的图片不得超过3M");
            // 是否需要压缩
        }
        return isLt2M;
    }

    render() {
        const imgprops = {
            name: 'chat-file',
            accept: '.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff',
            multiple: true,
            action: '',
            showUploadList: false,
            beforeUpload: this.beforeUpload,
            transformFile: async (file: any) => {
                // 超过1M需要压缩 
                if(file.size / 1024 / 1024 > 0.5){
                    lrz(file, {quality:0.1}).then((rst: { base64: any; })=>{
                        // 处理成功会执行
                        self.setState({
                            comdfileData: rst.base64
                        });
                    });
                }
                const self = this;
                let reader = new FileReader();
                reader.onload = function (ev: any) {
                    // base64码
                    const imgFile = ev.target.result;
                    self.setState({
                        fileData: imgFile,
                        comdfileData: imgFile
                    });
                }
                this.setState({
                    file: file
                });
                reader.readAsDataURL(file);

                const now = moment(new Date()).toString
                let fd = new FormData();
                fd.append(now + 'chatImg', this.state.file);


                const sendSinglePicture=function(){
                
                    self.props.JIM.sendSinglePic({
                        'target_username': self.props.target_name,
                        // 'appkey' : '',
                        'target_nickname': String(localStorage.getItem("accountId")),
                        'image': fd //构造好的 FormData
                    }).onSuccess(function (data: any) {
                        console.log('onsuccess')
                        self.setState({
                            create_time: data.ctime_ms
                        });
                        self.setMyimgMsg(data);
                        self.setContentToApi();
                    }).onFail(function (data: any) {
                        message.error(formatMessage({ id: 'UserMenuComponent-ChatImg.Messagefailed' }));
                    });
                }

                this.props.JIM.updateSelfInfo({
                    'nickname' : String(localStorage.getItem("accountId")),
                  }).onSuccess(function(data) {
                    console.log('nickname')
                    sendSinglePicture();
                    console.log('sendSinglePicture')
                  }).onFail(function(data) {
                    sendSinglePicture();
                  });

                return String(reader.result);
            }
        };
        return <Upload {...imgprops}>
            <img src={require('../../Image/imgFile.png')} />
        </Upload >
    };
}
export default ChatImg;