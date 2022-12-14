import { MenuModelType } from '@/models/menu';
import { connect } from 'dva';
import React from 'react';
import { Content } from './ChatModels';
import { JIM } from './ChatObject';
import { message, Modal } from 'antd';
import { isNil } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import commonCss from '../../Common/css/CommonCss.less';
import moment from 'moment';

const PNG = require('../../Image/kefu.png');
// const LOADINGPNG = require('../../Image/voyage.png');//voyage default
const DefaultPNG = require('../../Image/shipowner.png');
const SHIP_OWNER_AVATAR_PNG = require('../../Image/shipowner_avatar.png');
const SHIPPER_AVATAR_PNG = require('../../Image/shipper_avatar.png');

@connect((menuModel: MenuModelType) => ({
    menuModel: menuModel,
}))
class ChatWindow extends React.Component<{
    sysmsgs: []; myself: string, msgs: Content[]; headPng: string; targetUser: string

}, {}> {
    state = {
        matualMsg: [],
        scrolls: [],
        img: Array,
        previewImage: '',
        previewVisible: false
    };
    // 初期化
    componentDidUpdate = (prevProps: any) => {
        if (this.props.targetUser !== prevProps.targetUser || this.props.msgs.length !== prevProps.msgs.length) {
            this.scrollToBottom();
        }
    }

    // 滚到底部
    scrollToBottom = () => {

        const ul_menu = document.getElementsByClassName("list");

        const scroll: HTMLCollectionOf<HTMLLIElement> = ul_menu[0].getElementsByTagName('li');

        if (scroll && scroll.length > 0) {
            // scroll[scroll.length - 1].scrollIntoView({ behavior: 'smooth' });
            scroll[scroll.length - 1].scrollIntoView();
        }

    }

    // 图片预览
    handlePreview = (previewImage: string) => {
        this.setState({
            previewVisible: true,
            previewImage: previewImage
        });
    };

    //取消预览
    handleCancel = () => {
        this.setState({ previewVisible: false });
    };

    handleOnLoad = () => {
        this.scrollToBottom();
    }

    render() {
        let headPng = '';
        let mystyle = 'chatItem ';
        const modelPic = (<Modal
            visible={
                isNil(this.state) || isNil(this.state.previewVisible)
                    ? false
                    : this.state.previewVisible
            }
            footer={null}
            onCancel={this.handleCancel}
        >
            <img
                alt="example"
                style={{ width: '100%' }}
                src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
            />
        </Modal>);
        const userType = localStorage.getItem('userType');
        // 如果我是客服，使用头像
        if (String(userType) === '1' || String(userType) === '3') {
            headPng = PNG;
        } else if (String(userType) === '4') {
            headPng = SHIPPER_AVATAR_PNG;
        } else if (String(userType) === '5') {
            headPng = SHIP_OWNER_AVATAR_PNG;
        }
        else {
            headPng = DefaultPNG;
        }
        let self = this;
        let liList: JSX.Element[] = (this.props.msgs.map((msg, index) => {
            if (msg.msg_body.text) {
                msg.msg_body.text = msg.msg_body.text.replace(new RegExp('\n', 'g'), '<br>');
            }
            if (String(msg.from_id) === this.props.myself) {
                mystyle = 'chatItem myChat';
                if (String(userType) === '1' || String(userType) === '3') {
                    headPng = PNG;
                } else if (String(userType) === '4') {
                    headPng = SHIPPER_AVATAR_PNG;
                } else if (String(userType) === '5') {
                    headPng = SHIP_OWNER_AVATAR_PNG;
                }
                else {
                    headPng = DefaultPNG;
                }
            } else {
                mystyle = 'chatItem';
                headPng = self.props.headPng;
            }
            if ((msg.msg_type === 'image') && isNil(msg.img)) {

                msg.img = '../../Image/kefu.png';
                // msg.img = LOADINGPNG;
                const li_listByClass = document.getElementsByClassName("chat-wrapper")[0];
                const li_list = li_listByClass.getElementsByTagName("li");
                for (let i = 0, len = li_list.length; i < len; i++) {
                    li_list[i].className = '';
                    if (index === i) {
                        const liCurrent: HTMLImageElement = li_list[i].getElementsByTagName("img")[1];
                        //liCurrent.style // TODO 限制图片大小
                        if(liCurrent){
                        liCurrent.src = String(msg.img);
                        }
                    }
                }
                
                JIM.getResource({
                    'media_id': msg.msg_body.media_id,
                }).onSuccess((data: any) => {
                    msg.img = data.url;
                    const li_listByClass = document.getElementsByClassName("chat-wrapper")[0];
                    const li_list = li_listByClass.getElementsByTagName("li");
                    for (let i = 0, len = li_list.length; i < len; i++) {
                        li_list[i].className = '';
                        if (index === i) {
                            const liCurrent: HTMLImageElement = li_list[i].getElementsByTagName("img")[1];
                            //liCurrent.style // TODO 限制图片大小
                            liCurrent.src = String(msg.img);
                        }
                    }
                }).onFail((data: any) => {
                    message.error(formatMessage({ id: 'UserMenuComponent-ChatWindow.ChatPictureFailed' }));
                });
            }

            return (<li key={index} >
                <div className={mystyle}>
                    <div className="userImg">
                        <img src={headPng} className="" />
                    </div>
                    <div className="msg-render">
                        {
                            msg.msg_type === 'image' || msg.img ? <img src={msg.img} style={{ width: '200px' }} className=""
                                onClick={() => { this.handlePreview(String(msg.img)) }} onLoad={() => {this.handleOnLoad()}}/> :
                                <p dangerouslySetInnerHTML={{ __html: msg.msg_body.text }} />
                            // <p>{msg.msg_body.text}</p>
                        }
                    </div>
                </div>
            </li>)
        }));
        let systemMsg: JSX.Element[] = []
        if (this.props.sysmsgs && this.props.sysmsgs.length > 0) {
            systemMsg = this.props.sysmsgs.map((msg: any, index) => {
                const time = moment(Number(msg.sendTime)).format('YYYY-MM-DD HH:mm:ss');
                let sysmsg = msg.content.replace('[', '<span'+'\ '+ 'style="color:#C96267">');
                sysmsg = sysmsg.replace(']', '</span>');
                return (<li key={0 - index}><div className="systemNews">
                    <div className="news">
                        <div className={commonCss.title}>
                            <span className={commonCss.text}>{msg.title}</span>
                            <span className="time">{time}</span>
                        </div>
                        <div className="content">
                            <div dangerouslySetInnerHTML={{ __html: sysmsg }} />
                        </div>
                    </div>
                </div>
                </li>);
            })
        };

        return (
            <div className="chat-content">
                <ul className="list">
                    {systemMsg && systemMsg.length > 0 ? systemMsg : liList}
                </ul>
                {modelPic}
            </div>

        );

    }
}

function mapStateToProps(state: { menu: { isShow: boolean; visible: boolean } }) {
    const { isShow, visible } = state.menu;
    return {
        isShow,
        visible,
    };
}

export default connect(mapStateToProps)(ChatWindow);
