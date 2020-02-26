import React, { useEffect, useState } from "react";
type PacEntityRecord = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
type PacDataSet = ComponentFramework.PropertyTypes.DataSet;
import PacDataSetApi = ComponentFramework.PropertyHelper.DataSetApi;
import { Fabric, TextField } from "office-ui-fabric-react";

export interface IEditableGridCell {
    initialValue: string
    onCellValueChange: (newValue: string) => void,
}

export function EditableGridCell(props: IEditableGridCell) {

    const [isReadOnly, setIsReadOnly] = useState(true);
    const [cellValue, setCellValue] = useState(props.initialValue);

    const displayReadOnly = (
        <div
            onClick={onCellClick}>
            {cellValue}
        </div>
    );

    const displayEdit = (
        <TextField
            value={cellValue}
            onBlur={onTextFieldBlur}
            onChange={onTextFieldChange}
        />
    );

    return (
        <Fabric>
            {isReadOnly &&
                displayReadOnly
            }
            {!isReadOnly &&
                displayEdit
            }
        </Fabric>
    );

    function onCellClick() {
        setIsReadOnly(false);
    }

    function onTextFieldBlur() {
        setIsReadOnly(true);
        props.onCellValueChange(cellValue);
    }

    function onTextFieldChange(ev: any, newValue: string) {
        setCellValue(newValue);
    }
}

export default EditableGridCell;