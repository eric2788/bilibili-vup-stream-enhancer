import { useCallback, useState } from 'react';
import PromiseHandler from '~components/PromiseHandler';
import db, { type RecordType, type TableType } from '~database';
import type { FeatureType } from "~features";
import type { Settings } from "~options/fragments";


/**
 * Props for the OfflineRecordsProvider component.
 * @template T - The type of the table.
 */
export type OfflineRecordsProviderProps<T extends TableType> = {
    feature: FeatureType; // The feature type.
    settings: Settings; // The settings object.
    room: string; // The room name.
    table: T; // The table type.
    filter?: (x: RecordType<T>) => boolean; // Optional filter function.
    sortBy?: keyof RecordType<T>; // Optional key to sort the records by.
    reverse?: boolean; // Optional flag to reverse the sorting order.
    loading: React.ReactNode; // The loading indicator.
    error: (err: any, retry: VoidFunction) => React.ReactNode; // Function to render the error message.
    children: (data: RecordType<T>[]) => React.ReactNode; // Function to render the children components.
}

/**
 * Provides offline records for a specific table type.
 *
 * @template T - The type of the table.
 * @param {OfflineRecordsProviderProps<T>} props - The props for the OfflineRecordsProvider component.
 * @returns {JSX.Element} - The rendered OfflineRecordsProvider component.
 */
function OfflineRecordsProvider<T extends TableType>(props: OfflineRecordsProviderProps<T>): JSX.Element {

    const { settings, table, feature, children, loading, error, room, reverse, sortBy, filter } = props
    const { enabledRecording } = settings['settings.features']

    const getRecords = useCallback(() => {
        let records = db[table].where({ room })
        if (filter) {
            records = records.filter((t: any) => filter(t))
        }
        if (reverse) {
            records = records.reverse()
        }
        if (sortBy) {
            return records.sortBy(sortBy.toString())
        }
        return records.toArray()
    }, [table, room])

    const [fetcher, setFetcher] = useState<() => Promise<unknown>>(getRecords)
    const retry = () => setFetcher(getRecords)

    return (
        <>
            {enabledRecording.includes(feature) ? (
                <PromiseHandler promise={fetcher} >
                    <PromiseHandler.Error>
                        {err => error(err, retry)}
                    </PromiseHandler.Error>
                    <PromiseHandler.Response>
                        {children}
                    </PromiseHandler.Response>
                    <PromiseHandler.Loading>
                        {loading}
                    </PromiseHandler.Loading>
                </PromiseHandler>
            ) : children([])}
        </>
    )
}

export default OfflineRecordsProvider