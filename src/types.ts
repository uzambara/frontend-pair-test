export interface StagePayload {
    payload_type: string;
}

export interface Rocket {
    rocket_name: string;
    second_stage: {
        payloads: StagePayload[];
        block: number;
    }
}

export interface LaunchData {
    rocket: Rocket,
    launch_date_utc: string;
    mission_name: string;
    id: string;
    links: {
        mission_patch_small: string | null;
    }
}

export type LaunchDataKeys = keyof LaunchData | "";

export type SortOrder = 'asc' | 'desc' | "";

export type Pair = {
    key: string,
    value: string,
}