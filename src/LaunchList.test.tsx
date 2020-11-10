import React from 'react';
import { render, screen } from '@testing-library/react';

import { LaunchData } from './types';
import LaunchList from './LaunchList';

import { fetchUpcomingLaunches } from './api';
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
  (fetchUpcomingLaunches as jest.Mock).mockResolvedValue(mockLaunches)
})

test('renders upcoming launches', async () => {
  render(<LaunchList/>);

  const titleElement = screen.getByText("Upcoming Launches");
  expect(titleElement).toBeInTheDocument();

  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchUpcomingLaunches).toBeCalledTimes(1);
});

test('renders sort by dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await screen.findByRole('combobox');
  expect(dropdownElement).toBeInTheDocument();
});

test('renders search input', async () => {
  render(<LaunchList/>);

  const searchInput = await screen.findByRole('textbox');
  expect(searchInput).toBeInTheDocument();
});

