import React from "react";

import { LaunchData } from './types';

import { fetchUpcomingLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchUpcomingLaunches(limit);

            setEntries(results)
        };

        retrieveListItems();
    }, [setEntries, limit]);

    return (
        <section className="App-list">
            <h4>Upcoming Launches</h4>
            <p>List of upcoming SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select name="sortOrder" id="sortOrder" data-testid="sortOrder">
                        <option value="">-</option>
                    </select>
                </div>
                <div className="App-list-control">
                    <label htmlFor="textSearch">
                        Search
                    </label>
                    <input name="textSearch" id="textSearch"
                        placeholder="Type mission name..."
                        data-testid="textSearch"/>
                </div>
            </div>
            <ul>{
                entries.map((entry) => <li key={entry.id}>
                    <LaunchListEntry entry={entry}/>
                </li>)
            }</ul>
        </section>
    )
};

export default LaunchList;