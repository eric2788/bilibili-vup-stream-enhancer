
import React, { type BaseSyntheticEvent, useRef, useState } from 'react';

import { Button, Card, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import { useKeyDown } from '@react-hooks-library/core';

export type TableAction<T> = {
    icon?: React.ReactNode
    label: string
    onClick: (item: T) => void
}


export type TableHeader<T, K extends keyof T = keyof T> = {
    name: string
    value: K
    render?: (v: T[K]) => React.ReactNode
    align?: 'left' | 'right' | 'center'
}

export type DataTableProps<T extends object> = {
    title: string
    headers: TableHeader<T>[]
    values: T[]
    actions: TableAction<T>[]
    onAdd?: (value: string) => void
    headerSlot?: React.ReactNode
}

function ClickableAddIcon({ onClick }: { onClick: (e: BaseSyntheticEvent) => void }): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white cursor-pointer" onClick={onClick}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    )
}

function DataTable<T extends object>(props: DataTableProps<T>): JSX.Element {

    const [input, setInput] = useState('')


    const inputRef = useRef<HTMLInputElement>(null)

    const onAdd = (e: Event | any) => {
        e?.preventDefault()
        if (!input) return
        props.onAdd?.(input)
        setInput('')
    }

    useKeyDown('Enter', onAdd, { target: inputRef })


    const headers: Pick<TableHeader<T>, 'name' | 'align'>[] = [...props.headers, { name: '', align: 'center' }]

    return (
        <div className='w-full'>
            <div className="mb-3 flex flex-col items-center justify-between gap-4 md:flex-row w-full">
                <Typography variant="h6">{props.title}</Typography>
                {props.headerSlot}
                <div className="w-full md:w-72">
                    <Input ref={inputRef} crossOrigin={'annoymous'} type="text" value={input} onChange={(e) => setInput(e.target.value)} variant="standard" label="新增到列表" icon={<ClickableAddIcon onClick={onAdd} />} />
                </div>
            </div>
            <Card className="h-full w-full overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {headers.map(({ name, align = 'left' }) => (
                                <th
                                    key={name}
                                    className={`border-b border-blue-gray-100 dark:border-gray-800 bg-blue-gray-50 dark:bg-gray-700 p-4 ${align ? `text-${align}` : ''}`}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70 dark:text-gray-50"
                                    >
                                        {name}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="dark:bg-gray-600">
                        {props.values.map((row, index) => {

                            const isLast = index === props.values.length - 1;
                            const classes = isLast ? "py-2 px-4" : "py-2 px-4 border-b border-blue-gray-50";

                            return (
                                <tr key={index}>
                                    {props.headers.map(header => (
                                        <td className={`${classes} ${header.align ? `text-${header.align}` : ''}`} key={`${header.name}-${index}`}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal dark:text-gray-200"
                                            >
                                                {header.render ? header.render(row[header.value]) : String(row[header.value])}
                                            </Typography>
                                        </td>
                                    ))}
                                    <td className={`${classes} flex justify-start gap-3 dark:text-gray-200 dark:stroke-gray-200 text-center`}>
                                        {props.actions.map((action, index) =>
                                            action.icon ? (
                                                <Tooltip content={action.label} key={index}>
                                                    <IconButton key={index} variant="text" onClick={() => action.onClick(row)}>
                                                        {action.icon}
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Button key={index} variant="text" onClick={() => action.onClick(row)}>{action.label}</Button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {props.values.length === 0 &&
                            (
                                <tr>
                                    <td className="p-4 text-center" colSpan={headers.length}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal dark:text-gray-200"
                                        >
                                            暂无数据
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </Card>
        </div>
    )
}


export default DataTable