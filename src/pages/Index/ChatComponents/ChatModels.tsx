// 消息体
export interface Content {
    img?: string,
    ctime_ms: number,
    from_id: string, 
    from_name: string, 
    target_id: string,
    create_time: number,
    msg_type: string,
    msg_body: {
        text: string,
        media_id?:string
    }
}
// 实时消息体
export interface ReceiveMsg {
    from_username?: string,
    msg_id?: number,
    content:Content
}
// 离线 所有target 消息
export interface ConversationMsg {
    from_appkey?: string,
    from_username?: string,
    unread_msg_count?: number,
    msgs?:ConversationContent[]
}
// 离线 某个target 消息
export interface ConversationContent {
    ctime_ms: number,
    content: Content
}