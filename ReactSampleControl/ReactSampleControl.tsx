import { Fabric, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";

export interface IReacSampleControlProps {
    disabled?: boolean;
    placeholder?: string;
    text: string;
    notifyChange: (newValue: string) => void;
}

function ReactSampleControl(props: IReacSampleControlProps) {

    const [text, setText] = useState(props.text);

    useEffect(() => {
        if (props.text !== text) {
            setText(props.text);
        }
    }, [props.text]);

    return (
        <Fabric>
            <TextField
                disabled={props.disabled}
                placeholder={props.placeholder}
                value={text}
                onChange={onChange}
                onBlur={notifyChange}
            />
        </Fabric>
    );

    function onChange(ev: any, newValue: string | undefined) {
        setText(newValue || "");
    }

    function notifyChange() {
        if (text !== props.text) {
            props.notifyChange(text);
        }
    }
}

export default ReactSampleControl;