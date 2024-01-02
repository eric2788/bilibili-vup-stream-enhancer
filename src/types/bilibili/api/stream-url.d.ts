export interface StreamUrlResponse {
    room_id: number;
    short_id: number;
    uid: number;
    is_hidden: boolean;
    is_locked: boolean;
    is_portrait: boolean;
    live_status: number;
    hidden_till: number;
    lock_till: number;
    encrypted: boolean;
    pwd_verified: boolean;
    live_time: number;
    room_shield: number;
    all_special_types: number[];
    playurl_info: {
        conf_json: string;
        playurl: {
            cid: number;
            g_qn_desc: {
                qn: number;
                desc: string;
                hdr_desc: string;
                attr_desc: null | string;
            }[];
            stream: {
                protocol_name: string;
                format: {
                    format_name: string;
                    codec: {
                        codec_name: string;
                        current_qn: number;
                        accept_qn: number[];
                        base_url: string;
                        url_info: {
                            host: string;
                            extra: string;
                            stream_ttl: number;
                        }[];
                        hdr_qn: null | number;
                        dolby_type: number;
                        attr_name: string;
                    }[];
                }[];
            }[];
            p2p_data: {
                p2p: boolean;
                p2p_type: number;
                m_p2p: boolean;
                m_servers: null | string;
            };
            dolby_qn: null | number;
        };
    };
    official_type: number;
    official_room_id: number;
}