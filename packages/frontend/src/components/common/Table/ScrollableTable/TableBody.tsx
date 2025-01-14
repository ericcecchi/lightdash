import { isNumericItem, ResultRow } from '@lightdash/common';
import { Cell, flexRender } from '@tanstack/react-table';
import React, { FC, Fragment, useState } from 'react';
import { BodyCell } from '../Table.styles';
import { useTableContext } from '../TableProvider';
import { TableColumn } from '../types';
import RichBodyCell from './RichBodyCell';

const TableBody: FC = () => {
    const { table, cellContextMenu, tableWrapperRef, setIsScrollable } =
        useTableContext();
    const CellContextMenu = cellContextMenu || Fragment;
    const [selectedCell, setSelectedCell] = useState<string>();

    const handleCellSelect = (cellId: string | undefined) => {
        setIsScrollable(!cellId);
        setSelectedCell(cellId);
    };

    return (
        <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef
                            .meta as TableColumn['meta'];

                        return (
                            <CellContextMenu
                                key={cell.id}
                                cell={cell as Cell<ResultRow, ResultRow[0]>}
                                boundaryElement={tableWrapperRef.current}
                                onOpen={() => handleCellSelect(cell.id)}
                                onClose={() => handleCellSelect(undefined)}
                            >
                                <BodyCell
                                    $rowIndex={rowIndex}
                                    $isSelected={cell.id === selectedCell}
                                    $isInteractive={!!cellContextMenu}
                                    $hasData={!!meta?.item}
                                    $isNaN={
                                        !meta?.item || !isNumericItem(meta.item)
                                    }
                                >
                                    <RichBodyCell
                                        cell={
                                            cell as Cell<
                                                ResultRow,
                                                ResultRow[0]
                                            >
                                        }
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </RichBodyCell>
                                </BodyCell>
                            </CellContextMenu>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;
