export interface WbiAccInfoResponse {
    mid: number;
    name: string;
    sex: string;
    face: string;
    face_nft: number;
    face_nft_type: number;
    sign: string;
    rank: number;
    level: number;
    jointime: number;
    moral: number;
    silence: number;
    coins: number;
    fans_badge: boolean;
    fans_medal: {
        show: boolean;
        wear: boolean;
        medal: {
            uid: number;
            target_id: number;
            medal_id: number;
            level: number;
            medal_name: string;
            medal_color: number;
            intimacy: number;
            next_intimacy: number;
            day_limit: number;
            medal_color_start: number;
            medal_color_end: number;
            medal_color_border: number;
            is_lighted: number;
            light_status: number;
            wearing_status: number;
            score: number;
        };
    };
    official: {
        role: number;
        title: string;
        desc: string;
        type: number;
    };
    vip: {
        type: number;
        status: number;
        due_date: number;
        vip_pay_type: number;
        theme_type: number;
        label: {
            path: string;
            text: string;
            label_theme: string;
            text_color: string;
            bg_style: number;
            bg_color: string;
            border_color: string;
            use_img_label: boolean;
            img_label_uri_hans: string;
            img_label_uri_hant: string;
            img_label_uri_hans_static: string;
            img_label_uri_hant_static: string;
        };
        avatar_subscript: number;
        nickname_color: string;
        role: number;
        avatar_subscript_url: string;
        tv_vip_status: number;
        tv_vip_pay_type: number;
        tv_due_date: number;
    };
    pendant: {
        pid: number;
        name: string;
        image: string;
        expire: number;
        image_enhance: string;
        image_enhance_frame: string;
    };
    nameplate: {
        nid: number;
        name: string;
        image: string;
        image_small: string;
        level: string;
        condition: string;
    };
    user_honour_info: {
        mid: number;
        colour: string | null;
        tags: string[];
    };
    is_followed: boolean;
    top_photo: string;
    theme: {};
    sys_notice: {};
    live_room: {
        roomStatus: number;
        liveStatus: number;
        url: string;
        title: string;
        cover: string;
        roomid: number;
        roundStatus: number;
        broadcast_type: number;
        watched_show: {
            switch: boolean;
            num: number;
            text_small: string;
            text_large: string;
            icon: string;
            icon_location: string;
            icon_web: string;
        };
    };
    birthday: string;
    school: {
        name: string;
    };
    profession: {
        name: string;
        department: string;
        title: string;
        is_show: number;
    };
    tags: null;
    series: {
        user_upgrade_status: number;
        show_upgrade_window: boolean;
    };
    is_senior_member: number;
    mcn_info: null;
    gaia_res_type: number;
    gaia_data: null;
    is_risk: boolean;
    elec: {
        show_info: {
            show: boolean;
            state: number;
            title: string;
            icon: string;
            jump_url: string;
        };
    };
    contract: {
        is_display: boolean;
        is_follow_display: boolean;
    };
}