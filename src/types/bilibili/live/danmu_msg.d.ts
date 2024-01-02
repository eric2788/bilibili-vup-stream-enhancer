export interface DanmuMsg {
    cmd: string;
    info: [
        [
            ...number[7],
            string,
            ...number[3],
            string,
            number,
            string | object, // can be image danmaku
            string | object,
            {
                mode: number,
                show_player_type: number,
                extra: string,
                user: {
                    uid: number,
                    base: {
                        name: string,
                        face: string,
                        is_mystery: boolean,
                        name_color: number
                    },
                    medal: null,
                    wealth: {
                        level: number
                    }
                }
            },
            {
                activity_identity: string,
                activity_source: number,
                not_show: number
            },
        ],
        string, // danmaku content
        [
            number, // uid
            string, // username
            number,
            number,
            number,
            number,
            number,
            string
        ],
        [
            number, // medal level
            string, // medal name
            string, // medal owner name
            number,
            number,
            string,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ],
        [
            number,
            number,
            number,
            string,
            number
        ],
        [
            string,
            string
        ],
        number,
        number,
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