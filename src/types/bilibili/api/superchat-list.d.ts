
export interface SuperChatList {
    list?: SuperChat[];
}

export interface SuperChat {
    id: number;
    uid: number;
    background_image: string;
    background_color: string;
    background_icon: string;
    background_bottom_color: string;
    background_price_color: string;
    font_color: string;
    price: number;
    rate: number;
    time: number;
    start_time: number;
    end_time: number;
    message: string;
    trans_mark: number;
    message_trans: string;
    ts: number;
    token: string;
    user_info: UserInfo;
    is_ranked: number;
    is_mystery: boolean;
    uinfo: any[];
}

export interface UserInfo {
    uname: string;
    face: string;
    face_frame: string;
    guard_level: number;
    user_level: number;
    is_vip: number;
    is_svip: number;
    is_main_vip: number;
}