import React from 'react';

import {
    Table as MaUTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
} from '@mui/material';
import {useFlexLayout, useTable} from 'react-table';
import AutoSizer from 'react-virtualized-auto-sizer';
import {FixedSizeList as List} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export default function Table({columns, data, loadNextPage}) {
    const {getTableProps, headerGroups, rows, prepareRow} = useTable(
        {
            columns,
            data,
        },
        useFlexLayout
    );

    //limit example to 1000 rows of data
    const itemCount = rows.length < 1000 ? rows.length + 1 : 1000;
    const isItemLoaded = (index) => !!rows[index];

    const RenderRow = React.useCallback(
        ({index, style}) => {
            if (!isItemLoaded(index)) {
                return (
                    <TableRow component="div" style={style}>
                        <TableCell
                            align="center"
                            component="div"
                            variant="body"
                            sx={{display: 'block', flex: 1}}
                        >
                            Loading...
                        </TableCell>
                    </TableRow>
                );
            }
            const row = rows[index];
            prepareRow(row);
            return (
                <TableRow component="div" {...row.getRowProps({style})}>
                    {row.cells.map((cell) => {
                        return (
                            <TableCell
                                component="div"
                                variant="body"
                                {...cell.getCellProps()}
                            >
                                {cell.render('Cell')}
                            </TableCell>
                        );
                    })}
                </TableRow>
            );
        },
        [prepareRow, rows]
    );

    return (
        <TableContainer component={Paper} sx={{height: "100vh"}}>
            <MaUTable
                component="div"
                size="small"
                stickyHeader
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                }}
                {...getTableProps()}
            >
                <TableHead component="div">
                    {headerGroups.map((headerGroup) => (
                        <TableRow component="div" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell component="div" {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody component="div" sx={{flex: 1}}>
                    <AutoSizer>
                        {({height, width}) => (
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={itemCount}
                                loadMoreItems={loadNextPage}
                            >
                                {({onItemsRendered, ref}) => (
                                    <List
                                        height={height}
                                        itemCount={itemCount}
                                        itemSize={33}
                                        onItemsRendered={onItemsRendered}
                                        ref={ref}
                                        width={width}
                                    >
                                        {RenderRow}
                                    </List>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                </TableBody>
            </MaUTable>
        </TableContainer>
    );
}
