import {getParams} from "./api";
import {LaunchDataKeys, SortOrder} from "./types";

test.each([
    ['limit, sort, and order should be in param string if values are not undefined', 10 , 'nameFilter', 'some_name', 'asc', `limit: 10, sort: "some_name", order: "asc", find: {mission_name: "nameFilter"}`] as const,
    ['undefined sort and order should not be in params string', 10 , "", undefined, undefined, `limit: 10`] as const,
    ['undefined sort and order should not be in params string', 10 , "", "", "", `limit: 10`] as const,
])('api test %s', (name, limit, missionNameFilter, order, sortOrder, expectedResult) => {
    const params = getParams(limit as number, missionNameFilter, order as LaunchDataKeys, sortOrder as SortOrder);

    expect(params).toEqual(expectedResult);
})