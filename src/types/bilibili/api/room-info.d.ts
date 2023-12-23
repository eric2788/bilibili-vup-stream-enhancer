// generated by AI, of course

export interface GetInfoByRoomResponse {
    room_info: RoomInfoResponse
    anchor_info: AnchorInfoResponse
}

export interface AnchorInfoResponse {
    base_info: {
        uname: string;
        face: string;
        gender: string;
        official_info: {
            role: number;
            title: string;
            desc: string;
            is_nft: number;
            nft_dmark: string;
        };
    };
    live_info: {
        level: number;
        level_color: number;
        score: number;
        upgrade_score: number;
        current: [number, number];
        next: [number, number];
        rank: string;
    };
    relation_info: {
        attention: number;
    };
    medal_info: {
        medal_name: string;
        medal_id: number;
        fansclub: number;
    };
    gift_info: {
        price: number;
        price_update_time: number;
    };
}


export interface RoomInfoResponse {
    uid: number;
    room_id: number;
    short_id: number;
    title: string;
    cover: string;
    tags: string;
    background: string;
    description: string;
    live_status: number;
    live_start_time: number;
    live_screen_type: number;
    lock_status: number;
    lock_time: number;
    hidden_status: number;
    hidden_time: number;
    area_id: number;
    area_name: string;
    parent_area_id: number;
    parent_area_name: string;
    keyframe: string;
    special_type: number;
    up_session: string;
    pk_status: number;
    is_studio: boolean;
    pendants: {
        frame: {
            name: string;
            value: string;
            desc: string;
        };
    };
    on_voice_join: number;
    online: number;
    room_type: {
        [key: string]: number;
    };
    sub_session_key: string;
    live_id: number;
    live_id_str: string;
    official_room_id: number;
    official_room_info: null;
    voice_background: string;
}