export interface InteractWord {
    cmd: string
    data: {
        contribution: {
            grade: number
        }
        contribution_v2: {
            grade: number
            rank_type: string
            text: string
        }
        core_user_type: number
        dmscore: number
        fans_medal: {
            anchor_roomid: number
            guard_level: number
            icon_id: number
            is_lighted: number
            medal_color: number
            medal_color_border: number
            medal_color_end: number
            medal_color_start: number
            medal_level: number
            medal_name: string
            score: number
            special: string
            target_id: number
        }
        group_medal: null
        identities: number[]
        is_mystery: boolean
        is_spread: number
        msg_type: number
        privilege_type: number
        roomid: number
        score: number
        spread_desc: string
        spread_info: string
        tail_icon: number
        tail_text: string
        timestamp: number
        trigger_time: number
        uid: number
        uinfo: {
            base: {
                face: string
                is_mystery: boolean
                name: string
                name_color: number
                origin_info: {
                    face: string
                    name: string
                }
                risk_ctrl_info: {
                    face: string
                    name: string
                }
            }
            uid: number
        }
        uname: string
        uname_color: string
    }
}