export interface SpecAreaRankResponse {
    list: {
        uid: number;
        rank: number;
        score: number;
        uname: string;
        face: string;
        link: string;
        live_status: number;
        top5: {
            uid: number;
            rank: number;
            uname: string;
            face: string;
            score: number;
        }[];
        rate: string;
        tag: string;
    }[];
    extra: {
        processing: number;
        promotion: number;
    };
    extra_text: {
        text: string;
        top_text: string;
    };
    info: {
        uid: number;
        rank: string;
        score: number;
        pre_score: number;
        is_rank: number;
        top5: null;
        uname: string;
        face: string;
        link: string;
        live_status: number;
        rate: string;
        diff_top: number;
        real_rank: number;
        diff_promotion: number;
    };
}