export default class Input {
	constructor(label, type = 'text') {
		this.label = label;
		this.type = type;
		this.value = '';
		this.error = '';
		this.isActive = '';
	}
}