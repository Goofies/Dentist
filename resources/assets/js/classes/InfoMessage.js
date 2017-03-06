export default class InfoMessage{
	constructor() {
		this.message = '';
		this.display = false;
		this.status = 'success';
	}
	success(message) {
		this.message = message;
		this.display = true;
		this.status = 'success';
		setTimeout(() => {
			this.display = false;
		},3000)
	}
	danger(message) {
		this.message = message;
		this.display = true;
		this.status = 'danger';
		setTimeout(() => {
			this.display = false;
		},3000)
	}
}