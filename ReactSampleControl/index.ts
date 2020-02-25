import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App, {IReacSampleControlProps} from "./app";

export class ReactSampleControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Reference to the notifyOutputChanged method
	private notifyOutputChanged: () => void;

	// Reference to the container div
	private theContainer: HTMLDivElement;

	// Reference to the React props, prepopulated with a bound event handler
	private props: IReacSampleControlProps = { 
		text: "",
		notifyChange: this.notifyChange.bind(this),
	}

	constructor() { }

	//Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	//Data-set values are not initialized here, use updateView.
	//@param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	//@param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	//@param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	//@param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		console.log("init() => context: ", context);

		this.notifyOutputChanged = notifyOutputChanged;
		this.theContainer = container;
	}

	//Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	//@param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		
		this.props.text = context.parameters.text.raw || "";
		this.props.disabled = context.mode.isControlDisabled;
		this.props.placeholder = context.parameters.placeholder.raw || "";

		// Render the React component into the div container
		ReactDOM.render(
			// Create the React component
			React.createElement(
				App, // the class type of the React component found in App.tsx
				this.props
			),
			this.theContainer
		);
	}

	public notifyChange(newValue: string): void {
		if (this.props.text !== newValue) {
			this.props.text = newValue;
			this.notifyOutputChanged();
		}
	}

	//It is called by the framework prior to a control receiving new data. 
	//@returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	public getOutputs(): IOutputs {
		return {
			text: this.props.text,
		}
	}

	//Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup. i.e. cancelling any pending remote calls, removing listeners, etc.
	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this.theContainer);
	}
}