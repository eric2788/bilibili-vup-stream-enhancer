export interface Movie {
    duration: number;
    timescale: number;
    tracks: (VideoTrack | AudioTrack)[];

    relativeDuration(): number
    resolution(): string
    size(): number
    addTrack(track: VideoTrack | AudioTrack): void
    videoTrack(): VideoTrack
    audioTrack(): AudioTrack
    samples(): number[]
    ensureDuration(): number

}

export interface VideoTrack {
    duration: number;
    timescale: number;
    extraData: Buffer;
    codec: string;
    samples: Sample[];
    width: number;
    height: number;
}

export interface AudioTrack {
    duration: number;
    timescale: number;
    extraData: Buffer;
    codec: string;
    samples: Sample[];
    channels: number;
    sampleRate: number;
    sampleSize: number;
}

export interface Sample {
    timestamp: number
    timescale: number
    size: number
    offset: number

    relativeTimestamp(): number
}