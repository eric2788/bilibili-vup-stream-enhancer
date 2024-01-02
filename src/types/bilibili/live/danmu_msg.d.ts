// 描述來源: https://github.com/xfgryujk/blivedm/blob/dev/blivedm/models/web.py

export interface DanmuMsg {
    cmd: string;
    info: [
        [
            number,
            number, // 弹幕显示模式（滚动、顶部、底部）
            number, // 字体尺寸
            number, // 颜色
            number, // 时间戳（毫秒）
            number, // 随机数，前端叫作弹幕ID，可能是去重用的
            number, 
            string, // 用户ID文本的CRC32
            number,
            number, // 是否礼物弹幕（节奏风暴）
            number, // 右侧评论栏气泡
            string,
            number,
            string | object, // 弹幕类型，0文本，1表情，2语音
            string | object, // 表情参数
            {
                mode: number,
                show_player_type: number,
                extra: string,
                user: {
                    uid: number, // 用户ID
                    base: {
                        name: string, // 用户名
                        face: string,
                        is_mystery: boolean,
                        name_color: number // 用户名颜色
                    },
                    medal: null,
                    wealth: {
                        level: number // 用户等级
                    }
                }
            },
            {
                activity_identity: string,
                activity_source: number,
                not_show: number
            },
        ],
        string, // 弹幕内容
        [
            number, // 用户ID
            string, // 用户名
            number, // 是否房管
            number, // 是否月费老爷
            number, // 是否年费老爷
            number, // 用户身份，用来判断是否正式会员，猜测非正式会员为5000，正式会员为10000
            number, // 是否绑定手机
            string  // 用户名颜色
        ],
        [
            number, // 勋章等级
            string, // 勋章名
            string, // 勋章房间主播名
            number, // 勋章房间ID
            number, // 勋章颜色
            string, // 特殊勋章
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ],
        [
            number, // 用户等级
            number,
            number, // 用户等级颜色
            string, // 用户等级排名，>50000时为'>50000'
            number
        ],
        [
            string, // 旧头衔
            string // 头衔
        ],
        number,
        number, // 舰队类型，0非舰队，1总督，2提督，3舰长
        null,
        {
            ts: number,
            ct: string
        },
        number,
        number,
        null,
        null,
        number,
        number,
        number[],
        null
    ];
    dm_v2: string;
}