import {fetchPastLaunches, getParams} from "./api";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {LaunchDataKeys, SortOrder} from "./types";
import datefns, {getTimezoneOffset} from "date-fns-tz";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test.each([
    ['limit, sort, and order should be in param string if values are not undefined', 10 , 'nameFilter', 'some_name', 'asc', `limit: 10, sort: "some_name", order: "asc", find: {mission_name: "nameFilter"}`] as const,
    ['undefined sort and order should not be in params string', 10 , "", undefined, undefined, `limit: 10`] as const,
    ['undefined sort and order should not be in params string', 10 , "", "", "", `limit: 10`] as const,
])('api test %s', (name, limit, missionNameFilter, order, sortOrder, expectedResult) => {
    const params = getParams(limit as number, missionNameFilter, order as LaunchDataKeys, sortOrder as SortOrder);

    expect(params).toEqual(expectedResult);
});

test("launch date has dd/mm/yyyy format and localte date time", async () => {
    // 4 hours offset wil give us next day. so lets check, that date convert to locale date.
    jest.spyOn(datefns, 'getTimezoneOffset').mockImplementation(() => 4 * 60 * 60 * 1000);
    server.use(
        rest.post('https://api.spacex.land/graphql/', (req, res, ctx) => {
            return res(ctx.json({
                data: {launchesPast: [
                    {launch_date_utc: "2020-10-21T23:17:00.000Z"},
                    {launch_date_utc: "2020-10-22T23:17:00.000Z"},
                    {launch_date_utc: "2020-10-23T23:17:00.000Z"},
                ]
            }}));
        })
    );
    const off = getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone, new Date());
    const result = await fetchPastLaunches(10, '', '', 'asc');
    expect(result).toStrictEqual([
        {launch_date_utc: "22/10/2020"},
        {launch_date_utc: "23/10/2020"},
        {launch_date_utc: "24/10/2020"},
    ]);
});