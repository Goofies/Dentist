export default class Input {
	constructor(label, type = 'text', name = '') {
		this.label = label;
		this.type = type;
		if(name){
			this.name = name;
		} else {
			this.name = this.label.toLowerCase().trim();
		}
		this.value = '';
		this.error = '';
		this.isActive = '';
	}
}