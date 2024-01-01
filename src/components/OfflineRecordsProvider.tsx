import { useCallback, useState } from 'react';
import PromiseHandler from '~components/PromiseHandler';
import db, { type RecordType, type TableType } from '~database';
import type { FeatureType } from "~features";
import type { Settings } from "~settings";


export type OfflineRecordsProviderProps<T extends TableType> = {
    feature: FeatureType
    settings: Settings
    room: string
    table: T
    reverse?: boolean
    loading: React.ReactNode
    error: (err: any, retry: VoidFunction) => React.ReactNode
    children: (data: RecordType<T>[]) => React.ReactNode
}


function OfflineRecordsProvider<T extends TableType>(props: OfflineRecordsProviderProps<T>): JSX.Element {

    const { settings, table, feature, children, loading, error, room, reverse } = props
    const { enabledRecording } = settings['settings.features']

    const getRecords = useCallback(() => {
        let records = db[table].where({ room })
        if (reverse) {
            records = records.reverse()
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