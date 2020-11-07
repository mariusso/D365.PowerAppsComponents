import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore 
import intlTelInput, { IIntTelInputProps } from 'intl-tel-input';

export interface IInternationalPhoneInputComponentProps {
    disabled?: boolean;
    phoneNumber: string;
    onChange: (newValue: string) => void;
}

function InternationalPhoneInputComponent(props: IInternationalPhoneInputComponentProps) {

    const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

    const [iti, setIti] = useState<any>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<string>(undefined);

    // Initializer - Run once
    useEffect(() => {
        const init = async () => {
            const phoneInput = document.querySelector("#phone");
            const iti = await intlTelInput(phoneInput, {
                allowDropdown: true,
                autoHideDialCode: false,
                autoPlaceholder: "Polite",
                customContainer: "",
                customPlaceholder: null,
                dropdownContainer: document.body,
                excludeCountries: [],
                formatOnDisplay: true,
                geoIpLookup: null,
                hiddenInput: "",
                initialCountry: "no",
                localizedCountries: {},
                nationalMode: true,
                onlyCountries: [],
                placeholderNumberType: "MOBILE",
                preferredCountries: ["no", "se", "dk", "fi"],
                separateDialCode: false,
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
            });

            setIti(iti);
        }
        init();
    }, []);

    // After Init  - Set event listener and phone number from props
    useEffect(() => {
        if (iti) {
            document.getElementById("phone").addEventListener("countrychange", onPhoneBlur);
            setPhoneNumber(props.phoneNumber);
        }
    }, [iti]);

    // After change in props - Set phone number
    useEffect(() => {
        if (iti) {
            setPhoneNumber(props.phoneNumber);
        }
    }, [props.phoneNumber]);

    // On state change of phone number
    useEffect(() => {
        if (iti) {
            props.onChange(phoneNumber)
            iti.setNumber(phoneNumber);
        }
    }, [phoneNumber]);

    const onPhoneBlur = useCallback(() => {
        if (iti) {
            const number = iti.getNumber();
            setPhoneNumber(number);
            iti.setNumber(number);
        }
    }, [iti]);

    const loading = iti === undefined;

    return (
        <div>
            <input type="tel" id="phone" onBlur={onPhoneBlur} disabled={props.disabled || loading} />
        </div>
    );
}

export default InternationalPhoneInputComponent;