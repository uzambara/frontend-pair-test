import React from 'react';
import {act, render, screen, waitFor, fireEvent} from '@testing-library/react';

import { LaunchData } from './types';
import LaunchList from './LaunchList';

import { fetchPastLaunches } from './api';
import userEvent from "@testing-library/user-event";
import {format, parseISO} from "date-fns";
jest.mock('./api');

const mockLaunches: LaunchData[] = [
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Crew Dragon"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-15T00:49:00.000Z",
    "mission_name": "Crew-1",
    "id": "107",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Satellite"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-01T00:00:00.000Z",
    "mission_name": "SXM-7",
    "id": "110",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Dragon 1.1"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-12-02T17:50:00.000Z",
    "mission_name": "CRS-21",
    "id": "112",
    "links": {
      "mission_patch_small": null
    }
  }
];

beforeEach(() => {
  (fetchPastLaunches as jest.Mock).mockResolvedValue(mockLaunches)
})

describe("Launch list tests", () => {
  test('renders past launches', async () => {
    render(<LaunchList/>);

    const titleElement = screen.getByText("Past Launches");
    expect(titleElement).toBeInTheDocument();

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBe(mockLaunches.length);

    expect(fetchPastLaunches).toBeCalledTimes(1);
  });

  test('renders sort and sort order by dropdown', async () => {
    render(<LaunchList/>);

    const sortCombo = await screen.findByTestId('sort');
    const sortOrderCombo = await screen.findByTestId('sortOrder');
    expect(sortCombo).toBeInTheDocument();
    expect(sortOrderCombo).toBeInTheDocument();
  });

  test('renders search input', async () => {
    render(<LaunchList/>);

    const searchInput = await screen.findByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  test("refetch data after sort changed", async () => {
    render(<LaunchList/>);

    const sortSelect = await screen.findByTestId('sort');

    await act(() => userEvent.selectOptions(sortSelect, 'Mission Name'));

    expect(fetchPastLaunches).toBeCalledTimes(2);
    expect(fetchPastLaunches).toBeCalledWith(10, "", "mission_name", "asc");
  });

  test.each([
      ["Mission Name sorting", "Mission Name", "mission_name"],
    ["Mission Date sorting", "Mission Date", "launch_date_utc"],
  ])("check %s", async (name, sortValue, sortField) => {
    render(<LaunchList/>);

    const sortedValues = mockLaunches.sort((a, b) => (a[sortField as keyof LaunchData] as string).localeCompare(b[sortField as keyof LaunchData] as string));
    (fetchPastLaunches as jest.Mock).mockResolvedValue(sortedValues);

    const sortSelect = await screen.findByTestId('sort');
    userEvent.selectOptions(sortSelect, sortValue);

    const missionNamesElements = await screen.findAllByTestId("missionName");
    const missionNames = missionNamesElements.map(el => el.innerHTML);

    expect(missionNames).toStrictEqual(sortedValues.map(v => v.mission_name));
  });

  test("check Asc sort order in table", async () => {
    render(<LaunchList/>);

    const sortedValues = mockLaunches.sort((a, b) => a.mission_name.localeCompare(b.mission_name));
    (fetchPastLaunches as jest.Mock).mockResolvedValue(sortedValues);

    const sortSelect = await screen.findByTestId('sort');
    userEvent.selectOptions(sortSelect, 'Mission Name');

    const sortOrderSelect = await screen.findByTestId('sortOrder');
    userEvent.selectOptions(sortOrderSelect, 'Asc');


    const missionNamesElements = await screen.findAllByTestId("missionName");
    const missionNames = missionNamesElements.map(el => el.innerHTML);

    expect(missionNames).toStrictEqual(sortedValues.map(v => v.mission_name));
  });

  test("check Desc sort order in table", async () => {
    render(<LaunchList/>);

    const sortedValues = mockLaunches.sort((a, b) => b.mission_name.localeCompare(a.mission_name));
    (fetchPastLaunches as jest.Mock).mockResolvedValue(sortedValues);

    const sortSelect = await screen.findByTestId('sort');
    userEvent.selectOptions(sortSelect, 'Mission Name');

    const sortOrderSelect = await screen.findByTestId('sortOrder');
    userEvent.selectOptions(sortOrderSelect, 'Desc');


    const missionNamesElements = await screen.findAllByTestId("missionName");
    const missionNames = missionNamesElements.map(el => el.innerHTML);

    expect(missionNames).toStrictEqual(sortedValues.map(v => v.mission_name));
  });

  test("check mission name filtering", async () => {
    render(<LaunchList/>);

    const nameFilter = 'XM';
    const filteredValues = mockLaunches.filter(el => el.mission_name.match(/XM/i));
    const mockedFetch = (fetchPastLaunches as jest.Mock).mockResolvedValue(filteredValues);

    const filterInput = await screen.findByTestId('textSearch');
    userEvent.type(filterInput, nameFilter);

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(10, "XM", "", "asc"));

    const missionNamesElements = await screen.findAllByTestId("missionName");
    const missionNames = missionNamesElements.map(el => el.innerHTML);

    expect(fetchPastLaunches).toBeCalledTimes(2);
    expect(missionNames).toStrictEqual(filteredValues.map(el => el.mission_name));
  });
});



