import React, {useState} from "react";

import {LaunchData, LaunchDataKeys, Pair, SortOrder} from './types';

import { fetchPastLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number,
    initialSort?: LaunchDataKeys,
    initialSortOrder?: SortOrder,
}

const SORT_OPTIONS: Pair[] = [
    {key: "mission_name", value: "Mission Name"}
]

const LaunchList: React.FC<Props> = ({limit = 10, initialSort = "", initialSortOrder = ""}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);
    const [sort, setSort] = useState<LaunchDataKeys>(initialSort);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchPastLaunches(limit, sort, sortOrder);

            setEntries(results)
        };

        retrieveListItems();
    }, [setEntries, limit, sort]);

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select name="sortOrder" id="sortOrder" data-testid="sortOrder" onChange={(event) => setSort(event.target.value as LaunchDataKeys)}>
                        <option key={""} value={""}/>
                        {
                            SORT_OPTIONS.map(({key, value}) => <option key={key} value={key}>{value}</option>)
                        }
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