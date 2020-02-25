import { TextField } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";

export interface IReacSampleControlProps {
    disabled?: boolean;
    placeholder?: string;
    text: string;
    notifyChange: (newValue: string) => void;
}

function App(props: IReacSampleControlProps) {

    const [text, setText] = useState(props.text);

    useEffect(() => {
        if(props.text !== text) {
            setText(props.text);
        }
    }, [props.text]);

    return (
        <TextField
            disabled={props.disabled}
            placeholder={props.placeholder}
            value={text}
            onChange={onChange}
            onBlur={notifyChange}
        />
    );

    function onChange(ev: any, newValue: string | undefined) {
        setText(newValue || "");
    }

    function notifyChange() {
        if(text !== props.text) {
            props.notifyChange(text);
        }
    }
}

export default App;