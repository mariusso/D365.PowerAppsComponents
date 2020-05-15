import { Fabric, TextField, Spinner, MessageBar, MessageBarType, initializeIcons, ITooltipHostStyles, TooltipHost, Callout } from "office-ui-fabric-react";
import React, { useEffect, useState, useCallback } from "react";
initializeIcons();

export interface IReacSampleControlProps {
    disabled?: boolean;
    phoneNumber: string;
    onChange: (newValue: string) => void;
}

function InternationalPhoneInputControl(props: IReacSampleControlProps) {

    const [iti, setIti] = useState<any>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<string>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (iti) {
            iti.setNumber(phoneNumber)
            if (phoneNumber !== props.phoneNumber) {
                props.onChange(phoneNumber);
            }
        }
    }, [phoneNumber])

    useEffect(() => {
        if (props.phoneNumber !== phoneNumber) {
            setPhoneNumber(props.phoneNumber);
        }
    }, [props.phoneNumber])

    useEffect(() => {
        if (iti) {
            document.getElementById("phone").addEventListener("countrychange", function () {
                const phoneNumber = iti.getNumber();
                setPhoneNumber(phoneNumber);
            });
            iti.setNumber(props.phoneNumber);
            setPhoneNumber(props.phoneNumber);
        }
    }, [iti]);

    useEffect(() => {
        init(setIti);
    }, []);

    const onBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const phoneNumber = iti.getNumber();
        setPhoneNumber(phoneNumber);
    }, [iti]);

    const loading = iti === undefined;

    return (
        <div>
            <input type="tel" id="phone" onBlur={onBlur} disabled={loading || props.disabled} />
        </div>
    );
}

async function init(setIti: (iti: any) => void) {

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.0/js/intlTelInput.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = async () => {
        const phoneInput = document.querySelector("#phone");
        const iti = await window["intlTelInput"](phoneInput, {
            allowDropdown: true,
            autoHideDialCode: true,
            autoPlaceholder: "Polite",
            customContainer: "",
            customPlaceholder: null,
            dropdownContainer: document.body,
            excludeCountries: [],
            formatOnDisplay: true,
            geoIpLookup: null,
            hiddenInput: "",
            initialCountry: "",
            localizedCountries: {},
            nationalMode: true,
            onlyCountries: [],
            placeholderNumberType: "MOBILE",
            preferredCountries: ["no", "se", "dk", "fi"],
            separateDialCode: false,
            // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.0/js/utils.js",
        });

        await window["intlTelInputGlobals"].loadUtils("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.0/js/utils.js");

        setIti(iti);
    }
}

const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

export default InternationalPhoneInputControl;

