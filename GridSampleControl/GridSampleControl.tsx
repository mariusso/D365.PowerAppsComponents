import { DetailsList, Fabric, IColumn, initializeIcons, SelectionMode } from "office-ui-fabric-react";
import React from "react";
import { EditableGridCell } from "../SharedComponents/EditableGridCell/EditableGridCell"
import { IInputs } from "./generated/ManifestTypes";
import PacPropTypes = ComponentFramework.PropertyTypes;
import PacPropHelper = ComponentFramework.PropertyHelper;
type WebApi = ComponentFramework.WebApi;

initializeIcons();

export interface IGridSampleProps {
    DataSet: PacPropTypes.DataSet,
    WebApi: WebApi,
}

export function GridSampleControl(props: IGridSampleProps) {

    const columns = getColumns();
    const rows = getRows();

    return (
        <Fabric>
            <DetailsList
                items={rows}
                columns={columns}
                selectionMode={SelectionMode.none}
            />
        </Fabric>
    )

    function getColumns(): Array<IColumn> {

        const propColumns = props.DataSet.columns;

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

        const itemsToRender = [];
        for (const recordId of props.DataSet.sortedRecordIds) {

            const columns = props.DataSet.columns;
            const record = props.DataSet.records[recordId];

            const rowItem: any = [];
            for (const column of columns) {

                const formattedValue = record.getFormattedValue(column.name);
                const entityReference = record.getNamedReference();

                rowItem[column.name] = <EditableGridCell
                    initialValue={formattedValue}
                    onCellValueChange={onCellValueChange.bind(null, entityReference, column.name)}
                />
            }

            itemsToRender.push(rowItem);
        }

        return itemsToRender;
    }

    async function onCellValueChange(entityReference: ComponentFramework.EntityReference, fieldName: string, newValue: string) {
        const updateRecord = {}
        updateRecord[fieldName] = newValue;

        try{
            await props.WebApi.updateRecord(entityReference.entityType, entityReference.id, updateRecord);
        }
        catch(e) {
            console.error("This is expected in the test harness: ", e);
        }
    }
}

export default GridSampleControl;