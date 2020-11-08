
//@ts-ignore
import intlTelInput from 'intl-tel-input';
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class InternationalPhoneInputComponentIndex implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Reference to the notifyOutputChanged method
	private notifyOutputChanged: () => void;

	// Reference to the div container and phone input element
	private componentContainer: HTMLDivElement;
	private phoneInput: HTMLInputElement;

	// Reference to the intTelInput object
	private iti: any;

	// Reference to the phone number value used by the component
	private phoneNumber: string;

	// Reference to the context object
	private context: ComponentFramework.Context<IInputs>;

	constructor() { }

	//Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	//Data-set values are not initialized here, use updateView.
	//@param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	//@param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	//@param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	//@param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {

		console.log("init");

		const init = async () => {

			this.context = context;
			this.notifyOutputChanged = notifyOutputChanged;

			this.componentContainer = container;
			this.phoneInput = document.createElement("input");
			this.componentContainer.appendChild(this.phoneInput);

			this.phoneInput.type = "tel";
			this.phoneInput.addEventListener("countrychange", this.onPhoneNumberChange);
			this.phoneInput.onblur = this.onPhoneNumberChange;
			this.phoneNumber = context.parameters.PhoneNumber.raw;

			this.iti = await intlTelInput(this.phoneInput, {
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

			this.iti.setNumber(this.phoneNumber);
		}

		init.call(this);
	}

	//Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	//@param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		console.log("updateView");

		this.context = context;
		this.phoneNumber = context.parameters.PhoneNumber.raw;

		this.iti.setNumber(this.phoneNumber);
	}

	//It is called by the framework prior to a control receiving new data. 
	//@returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	public getOutputs(): IOutputs {
		console.log("getOutputs");
		return {
			PhoneNumber: this.phoneNumber
		}
	}

	//Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup. i.e. cancelling any pending remote calls, removing listeners, etc.
	public destroy(): void {
		console.log("destroy");
		this.phoneInput.removeEventListener("countrychange", this.onPhoneNumberChange);
		this.phoneInput.removeEventListener("onblur", this.onPhoneNumberChange);
	}

	private onPhoneNumberChange = () => {
		console.log("onPhoneNumberChange");
		const phoneNumber = this.iti.getNumber();
		this.iti.setNumber(phoneNumber);
		this.phoneNumber = phoneNumber;

		if (this.context.parameters.PhoneNumber.raw !== this.phoneNumber) {
			this.notifyOutputChanged();			
		}
	}
}