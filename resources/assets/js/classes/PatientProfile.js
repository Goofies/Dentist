import PatientHistory from './PatientHistory'
export default class PatientProfile {
	constructor() {
		this.patient = '';
		this.edit = '';
		this.data = {
			name: '',
			lastname: '',
			phone: '',
			mobilephone: '',
			address: '',
			email: ''
		};
		this.history = '';
	}
	display(patient) {
		this.patient = patient;
		for (let property in patient) {
			this.data[property] = patient[property];
		}
		this.history = new PatientHistory(patient);
	}
	editProfile() {
		this.edit = true;
	}
	submitEdit() {
		this.edit = false;
		return new Promise((resolve, reject) => {
			axios.put('./patients/update', this.data)
				.then(response => resolve())
				.catch(error => console.log(error.data))
		})
	}
	cancelEdit() {
		this.edit = false;
		for (let property in this.patient) {
			this.data[property] = this.patient[property];
		}
	}
	inputLength(string) {
		return ((string.length - 2) < 1 ? 1 : (string.length - 2));
	}
	deletePatient(patient) {
		return new Promise((resolve, reject) => {
			axios.delete(`patients/${patient.id}/destroy`)
				.then(response => resolve(`${patient.name} ${patient.lastname} has been deleted!`))
				.catch(error => reject(error.response.data))
		})
	}
}