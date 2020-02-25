import { DetailsList, IColumn, initializeIcons, SelectionMode, TextField } from "office-ui-fabric-react";
import { IInputs } from "./generated/ManifestTypes";
import React = require("react");

initializeIcons();

export interface IGridSampleProps {
    Context: ComponentFramework.Context<IInputs>,
}

export function GridSample(props: IGridSampleProps) {

    const columns = getColumns();
    const rows = getRows();

    return (
        <DetailsList
            items={rows}
            columns={columns}
            selectionMode={SelectionMode.none}
        />
    )

    function getColumns(): Array<IColumn> {

        const propColumns = props.Context.parameters.GridSampleData.columns;

        const columns = new Array<IColumn>();

        for (const propColumn of propColumns) {
            const column: IColumn = {
                key: propColumn.name,
                name: propColumn.displayName,
                fieldName: propColumn.name,
                minWidth: 100,
                maxWidth: propColumn.visualSizeFactor,
            };

            columns.push(column);
        }

        return columns;
    }

    function getRows(): Array<any> {

        const gridSampleData = props.Context.parameters.GridSampleData;

        const itemsToRender = [];

        for (const recordId of gridSampleData.sortedRecordIds) {

            const columns = gridSampleData.columns;
            const record = gridSampleData.records[recordId];

            const rowItem: any = {};
            for (const column of columns) {
                rowItem[column.name] = record.getFormattedValue(column.name);
                rowItem["entityReference"] = record.getNamedReference();
            }

            itemsToRender.push(rowItem);
        }

        return itemsToRender;
    }
}