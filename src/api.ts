import {LaunchData, LaunchDataKeys, SortOrder} from './types';
import {format, getUnixTime, parse, parseISO} from "date-fns";
import { getTimezoneOffset } from 'date-fns-tz';

export async function fetchPastLaunches(limit: number, missionNameFilter: string, sort: LaunchDataKeys, order: SortOrder): Promise<LaunchData[]> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const params = getParams(limit, missionNameFilter, sort, order);

    const body = JSON.stringify({
        query: `{
            launchesPast(${params}) {
                rocket {
                    rocket_name
                    second_stage {
                        payloads {
                        payload_type
                        }
                        block
                    }
                }
                launch_date_utc
                mission_name
                id
                links {
                    mission_patch_small
                }
            }
        }`,
        variables: {},
    });

    const options: RequestInit = {
        method: "POST",
        redirect: "follow",
        headers,
        body,
    };

    const request = await fetch("https://api.spacex.land/graphql/", options);
    const response = await request.json();

    const result = (response.data.launchesPast as LaunchData[]);
    result.forEach(el => {
        const dateTime = parseISO(el.launch_date_utc);
        el.launch_date_utc = format(utcToLocal(dateTime), "dd/MM/yyyy");
    })

    return result;
}


export function getParams(limit: number, missionNameFilter: string, sort?: LaunchDataKeys, order?: SortOrder) {
    let parameters = `limit: ${limit}`;
    if (Boolean(sort)) {
        parameters += `, sort: "${sort}"`;
    }

    if (Boolean(order)) {
        parameters += `, order: "${order}"`;
    }

    if (Boolean(missionNameFilter)) {
        parameters += `, find: {mission_name: "${missionNameFilter}"}`;
    }

    return parameters;
}

function utcToLocal(date: Date): Date {
    const unix = getUnixTime(date);
    return new Date(unix * 1000 + getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone, date));
}
