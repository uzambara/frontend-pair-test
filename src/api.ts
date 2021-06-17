import {LaunchData, LaunchDataKeys, SortOrder} from './types';

export async function fetchPastLaunches(limit: number, sort: LaunchDataKeys, order: SortOrder): Promise<LaunchData[]> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const params = getParams(limit, sort, order);

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
        variables: {}
    });

    const options: RequestInit = {
        method: "POST",
        redirect: "follow",
        headers,
        body,
    };

    const request = await fetch("https://api.spacex.land/graphql/", options);
    const response = await request.json();

    return response.data.launchesPast;
}


export function getParams(limit: number, sort?: LaunchDataKeys, order?: SortOrder) {
    let parameters = `limit: ${limit}`;
    if (Boolean(sort)) {
        parameters += `, sort: "${sort}"`;
    }
    if (Boolean(order)) {
        parameters += `, order: "${order}"`;
    }

    return parameters;
}
